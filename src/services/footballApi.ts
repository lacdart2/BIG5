import type { Match, MatchStatus } from '../types/football'
import { LEAGUES } from '../types/league'

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY
const BASE_URL = import.meta.env.VITE_FOOTBALL_API_BASE_URL

/** Raw shape of one fixture object from API-Football's /fixtures response. */
interface ApiFixture {
    fixture: {
        id: number
        date: string
        status: { short: string; elapsed: number | null }
    }
    league: { id: number; name: string }
    teams: {
        home: { id: number; name: string; logo: string }
        away: { id: number; name: string; logo: string }
    }
    goals: { home: number | null; away: number | null }
}

const LIVE_CODES = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE']
const FINISHED_CODES = ['FT', 'AET', 'PEN', 'PST', 'CANC', 'ABD', 'AWD', 'WO']

/** Maps API-Football's many status codes down to our 3 simple states. */
function mapStatus(short: string): MatchStatus {
    if (LIVE_CODES.includes(short)) return 'live'
    if (FINISHED_CODES.includes(short)) return 'finished'
    return 'upcoming' // covers "NS" (not started), "TBD", etc.
}

/** Converts one raw API fixture into our app's Match shape. */
function mapFixtureToMatch(f: ApiFixture): Match {
    return {
        id: String(f.fixture.id),
        status: mapStatus(f.fixture.status.short),
        kickoff: f.fixture.date,
        minute: f.fixture.status.elapsed ?? undefined,
        homeTeam: {
            id: String(f.teams.home.id),
            name: f.teams.home.name,
            shortName: f.teams.home.name,
            crestUrl: f.teams.home.logo,
        },
        awayTeam: {
            id: String(f.teams.away.id),
            name: f.teams.away.name,
            shortName: f.teams.away.name,
            crestUrl: f.teams.away.logo,
        },
        homeScore: f.goals.home,
        awayScore: f.goals.away,
        competition: f.league.name,
    }
}

/**
 * Fetches ALL of today's fixtures worldwide in a single request, then
 * filters down to our 5 supported leagues client-side. This keeps us
 * at 1 API call instead of 5 — important on the free plan's 100/day cap.
 */
export async function fetchTodayFixtures(): Promise<Match[]> {
    const today = new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"

    const response = await fetch(`${BASE_URL}/fixtures?date=${today}`, {
        headers: { 'x-apisports-key': API_KEY },
    })

    if (!response.ok) {
        throw new Error(`Football API error: ${response.status}`)
    }

    const data = await response.json()
    const apiFixtures: ApiFixture[] = data.response ?? []
    const big5Ids = new Set(LEAGUES.map((l) => l.apiId))

    return apiFixtures
        .filter((f) => big5Ids.has(f.league.id))
        .map(mapFixtureToMatch)
}