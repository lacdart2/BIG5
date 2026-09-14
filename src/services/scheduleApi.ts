import type { Match, MatchStatus, Team } from '../types/football'


// football-data.org's competition codes for our 5 leagues.
const BIG5_CODES = ['PL', 'PD', 'SA', 'BL1', 'FL1']

/** Maps BIG5's UI league IDs to football-data.org competition codes. */
export const STANDINGS_CODES: Record<string, string> = {
    pl: 'PL',
    laliga: 'PD',
    seriea: 'SA',
    bundesliga: 'BL1',
    ligue1: 'FL1',
}

/** A league table row using the provider's official position and totals. */
export interface Standing {
    position: number
    team: Team
    played: number
    won: number
    drawn: number
    lost: number
    goalDifference: number
    points: number
}

interface ScheduleApiStanding {
    position: number
    team: { id: number; name: string; tla: string | null; crest: string | null }
    playedGames: number
    won: number
    draw: number
    lost: number
    goalDifference: number
    points: number
}

interface StandingsResponse {
    standings?: { table: ScheduleApiStanding[] }[]
}

interface ScheduleApiMatch {
    id: number
    utcDate: string
    status: string
    competition: { id: number; name: string }
    homeTeam: { id: number; name: string; shortName: string | null; crest: string | null }
    awayTeam: { id: number; name: string; shortName: string | null; crest: string | null }
    score: {
        fullTime: { home: number | null; away: number | null }
    }
}

const LIVE_STATUSES = ['IN_PLAY', 'PAUSED', 'EXTRA_TIME', 'PENALTY_SHOOTOUT']
const FINISHED_STATUSES = ['FINISHED', 'AWARDED']

/** Maps football-data.org's status enum to our 3 simple states. */
function mapStatus(status: string): MatchStatus {
    if (LIVE_STATUSES.includes(status)) return 'live'
    if (FINISHED_STATUSES.includes(status)) return 'finished'
    return 'upcoming' // SCHEDULED, TIMED, POSTPONED, SUSPENDED, CANCELLED
}

function mapMatch(m: ScheduleApiMatch): Match {
    return {
        id: String(m.id),
        status: mapStatus(m.status),
        kickoff: m.utcDate,
        homeTeam: {
            id: String(m.homeTeam.id),
            name: m.homeTeam.name,
            shortName: m.homeTeam.shortName ?? m.homeTeam.name,
            crestUrl: m.homeTeam.crest ?? undefined,
        },
        awayTeam: {
            id: String(m.awayTeam.id),
            name: m.awayTeam.name,
            shortName: m.awayTeam.shortName ?? m.awayTeam.name,
            crestUrl: m.awayTeam.crest ?? undefined,
        },
        homeScore: m.score.fullTime.home,
        awayScore: m.score.fullTime.away,
        competition: m.competition.name,
        leagueApiId: m.competition.id,
    }
}

/**
 * Fetches all Big 5 fixtures for the next 7 days in ONE request —
 * football-data.org supports real date-range + multi-competition
 * filtering on the free tier, unlike API-Football. Used by Week only:
 * scores here are delayed, not real-time, which is fine for schedule
 * browsing but wrong for live data (Today/Live stay on API-Football).
 */
export async function fetchWeekFixtures(): Promise<Match[]> {
    const today = new Date()
    const in7Days = new Date()
    in7Days.setDate(today.getDate() + 7)

    const dateFrom = today.toISOString().slice(0, 10)
    const dateTo = in7Days.toISOString().slice(0, 10)

    const url = `/schedule-api/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&competitions=${BIG5_CODES.join(',')}`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Schedule API error: ${response.status}`)
    }

    const data = await response.json()
    const matches: ScheduleApiMatch[] = data.matches ?? []

    return matches.map(mapMatch)
}

/** Fetches a competition's overall standings through the existing Vite proxy. */
export async function fetchStandings(competitionCode: string): Promise<Standing[]> {
    const response = await fetch(`/schedule-api/competitions/${competitionCode}/standings`)

    if (!response.ok) {
        throw new Error(`Schedule API error: ${response.status}`)
    }

    const data: StandingsResponse = await response.json()
    const table = data.standings?.[0]?.table ?? []

    return table.map((row) => ({
        position: row.position,
        team: {
            id: String(row.team.id),
            name: row.team.name,
            shortName: row.team.tla ?? row.team.name,
            crestUrl: row.team.crest ?? undefined,
        },
        played: row.playedGames,
        won: row.won,
        drawn: row.draw,
        lost: row.lost,
        goalDifference: row.goalDifference,
        points: row.points,
    }))
}
