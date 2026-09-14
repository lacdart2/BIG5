import type { Match, MatchStatus } from '../types/football'


// football-data.org's competition codes for our 5 leagues.
const BIG5_CODES = ['PL', 'PD', 'SA', 'BL1', 'FL1']

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