import type { Match, MatchStatus } from '../types/football'
import { LEAGUES } from '../types/league'

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY
const BASE_URL = import.meta.env.VITE_FOOTBALL_API_BASE_URL

export class FootballApiError extends Error { }

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

function mapStatus(short: string): MatchStatus {
    if (LIVE_CODES.includes(short)) return 'live'
    if (FINISHED_CODES.includes(short)) return 'finished'
    return 'upcoming'
}

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
        leagueApiId: f.league.id,
    }
}

/** True if API-Football's `errors` field indicates a real failure.
 * API-Football returns `errors: []` (empty array) on success, but an
 * object with ANY key (plan, rateLimit, requests, token, etc.) on
 * failure — so we check generically instead of naming each key, since
 * they've already used at least 3 different names for "quota exceeded". */
function hasApiError(errors: unknown): boolean {
    if (Array.isArray(errors)) return errors.length > 0
    if (errors && typeof errors === 'object') return Object.keys(errors).length > 0
    return false
}

function extractErrorMessage(errors: unknown): string {
    if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
        return Object.values(errors).join(', ')
    }
    return 'API-Football error'
}

export async function fetchFixturesByDate(date: string): Promise<Match[]> {
    const response = await fetch(`${BASE_URL}/fixtures?date=${date}`, {
        headers: { 'x-apisports-key': API_KEY },
    })

    if (!response.ok) {
        throw new FootballApiError(`Football API error: ${response.status}`)
    }

    const data = await response.json()

    if (hasApiError(data.errors)) {
        throw new FootballApiError(extractErrorMessage(data.errors))
    }

    const apiFixtures: ApiFixture[] = data.response ?? []
    const big5Ids = new Set(LEAGUES.map((l) => l.apiId))

    return apiFixtures
        .filter((f) => big5Ids.has(f.league.id))
        .map(mapFixtureToMatch)
}

export function fetchTodayFixtures(): Promise<Match[]> {
    const today = new Date().toISOString().slice(0, 10)
    return fetchFixturesByDate(today)
}