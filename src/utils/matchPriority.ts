import type { Match, Team } from '../types/football'

const CLUB_WEIGHTS: Record<string, number> = {
    'arsenal': 10,
    'barcelona': 10,
    'real madrid': 10,
    'manchester city': 10,
    'man city': 10,
    'liverpool': 10,
    'bayern munich': 10,
    'bayern munchen': 10,
    'paris saint germain': 9,
    'psg': 9,
    'inter': 9,
    'internazionale': 9,
    'manchester united': 9,
    'man united': 9,
    'juventus': 9,
    'ac milan': 9,
    'milan': 9,
    'atletico madrid': 8,
    'atleti': 8,
    'borussia dortmund': 8,
    'dortmund': 8,
    'napoli': 8,
    'chelsea': 8,
    'tottenham': 8,
    'tottenham hotspur': 8,
    'roma': 7,
    'as roma': 7,
    'newcastle': 7,
    'newcastle united': 7,
    'aston villa': 7,
    'bayer leverkusen': 7,
    'leverkusen': 7,
    'rb leipzig': 7,
    'psv': 7,
    'benfica': 7,
    'porto': 7,
    'sporting cp': 7,
    'sporting': 7,
    'marseille': 7,
    'olympique de marseille': 7,
    'lyon': 6,
    'olympique lyonnais': 6,
    'monaco': 6,
    'villarreal': 6,
    'real sociedad': 6,
    'athletic club': 6,
    'athletic bilbao': 6,
    'lille': 6,
    'atalanta': 6,
    'lazio': 6,
    'fiorentina': 5,
    'club brugge': 5,
    'galatasaray': 5,
    'fenerbahce': 5,
    'ajax': 5,
    'sevilla': 5,
    'real betis': 5,
}

function normalizeName(value: string) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\b(fc|cf|ac|sc|afc)\b/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function teamWeight(team: Team) {
    const candidates = [team.name, team.shortName]
        .map(normalizeName)
        .filter(Boolean)

    let best = 0

    for (const candidate of candidates) {
        best = Math.max(best, CLUB_WEIGHTS[candidate] ?? 0)

        for (const [club, weight] of Object.entries(CLUB_WEIGHTS)) {
            if (candidate.includes(club) || club.includes(candidate)) {
                best = Math.max(best, weight)
            }
        }
    }

    return best
}

function competitionWeight(match: Match) {
    const competition = normalizeName(match.competition)
    if (competition.includes('champions league')) return 4
    if (competition.includes('premier league')) return 3
    if (competition.includes('la liga') || competition.includes('primera division')) return 3
    if (competition.includes('serie a')) return 3
    if (competition.includes('bundesliga')) return 3
    if (competition.includes('ligue 1')) return 2
    return 0
}

function statusWeight(match: Match, now: number) {
    if (match.status === 'live') return 3
    if (match.status === 'upcoming' && new Date(match.kickoff).getTime() >= now) return 2
    if (match.status === 'finished') return 0
    return 1
}

/**
 * Picks the most interesting match of the selected day instead of simply
 * choosing the first kickoff. Club prominence drives the score, while
 * competition and live/upcoming status provide smaller tie-breakers.
 */
export function pickSpotlightMatch(matches: Match[], now = Date.now()): Match | undefined {
    if (matches.length === 0) return undefined

    return [...matches]
        .map((match) => ({
            match,
            score:
                teamWeight(match.homeTeam) +
                teamWeight(match.awayTeam) +
                competitionWeight(match) +
                statusWeight(match, now),
        }))
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score

            const aKickoff = new Date(a.match.kickoff).getTime()
            const bKickoff = new Date(b.match.kickoff).getTime()

            // Prefer live/upcoming fixtures over finished ones when prestige is tied.
            const aFinished = a.match.status === 'finished' ? 1 : 0
            const bFinished = b.match.status === 'finished' ? 1 : 0
            if (aFinished !== bFinished) return aFinished - bFinished

            return aKickoff - bKickoff
        })[0]?.match
}
