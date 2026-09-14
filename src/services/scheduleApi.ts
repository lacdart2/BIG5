import type { Match, MatchStatus, Team } from '../types/football'
import { LEAGUES } from '../types/league'

const BIG5_CODES = ['PL', 'PD', 'SA', 'BL1', 'FL1']

export const STANDINGS_CODES: Record<string, string> = {
    pl: 'PL',
    laliga: 'PD',
    seriea: 'SA',
    bundesliga: 'BL1',
    ligue1: 'FL1',
}

const CODE_TO_CANONICAL_ID: Record<string, number> = Object.fromEntries(
    LEAGUES.map((league) => [STANDINGS_CODES[league.id], league.apiId])
)

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
    competition: { id: number; name: string; code: string }
    homeTeam: { id: number; name: string; shortName: string | null; crest: string | null }
    awayTeam: { id: number; name: string; shortName: string | null; crest: string | null }
    score: {
        fullTime: { home: number | null; away: number | null }
    }
}

const LIVE_STATUSES = ['IN_PLAY', 'PAUSED', 'EXTRA_TIME', 'PENALTY_SHOOTOUT']
const FINISHED_STATUSES = ['FINISHED', 'AWARDED']

function mapStatus(status: string): MatchStatus {
    if (LIVE_STATUSES.includes(status)) return 'live'
    if (FINISHED_STATUSES.includes(status)) return 'finished'
    return 'upcoming'
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
        leagueApiId: CODE_TO_CANONICAL_ID[m.competition.code] ?? m.competition.id,
    }
}

// ── Short-lived request cache ────────────────────────────────────────
// football-data.org's free tier allows only 10 requests/minute. Dev
// testing (especially React StrictMode's intentional double-effect-fire)
// can burn through that instantly. This cache is a DEV SAFEGUARD only —
// production caching is Supabase's job later (MVP 0.6).
const CACHE_TTL_MS = 2 * 60 * 1000 // 2 minutes

function getCached<T>(key: string): T | null {
    try {
        const raw = sessionStorage.getItem(key)
        if (!raw) return null
        const { timestamp, data } = JSON.parse(raw)
        if (Date.now() - timestamp > CACHE_TTL_MS) return null
        return data as T
    } catch {
        return null
    }
}

function setCached(key: string, data: unknown) {
    try {
        sessionStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }))
    } catch {
        // sessionStorage full or unavailable — fail silently, just skip caching
    }
}

async function cachedFetch<T>(url: string, transform: (data: unknown) => T): Promise<T> {
    const cached = getCached<T>(url)
    if (cached) return cached

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Schedule API error: ${response.status}`)
    }

    const data = await response.json()
    const result = transform(data)
    setCached(url, result)
    return result
}
// ──────────────────────────────────────────────────────────────────────

async function fetchMatchesByDateRange(dateFrom: string, dateTo: string): Promise<Match[]> {
    const url = `/schedule-api/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&competitions=${BIG5_CODES.join(',')}`

    return cachedFetch(url, (data) => {
        const matches: ScheduleApiMatch[] = (data as { matches?: ScheduleApiMatch[] }).matches ?? []
        return matches.map(mapMatch)
    })
}

export function fetchWeekFixtures(): Promise<Match[]> {
    const today = new Date()
    const in7Days = new Date()
    in7Days.setDate(today.getDate() + 7)

    const dateFrom = today.toISOString().slice(0, 10)
    const dateTo = in7Days.toISOString().slice(0, 10)

    return fetchMatchesByDateRange(dateFrom, dateTo)
}

export function fetchTodayFixturesFallback(): Promise<Match[]> {
    const today = new Date().toISOString().slice(0, 10)
    return fetchMatchesByDateRange(today, today)
}

export async function fetchStandings(competitionCode: string): Promise<Standing[]> {
    const url = `/schedule-api/competitions/${competitionCode}/standings`

    return cachedFetch(url, (data) => {
        const table = (data as StandingsResponse).standings?.[0]?.table ?? []
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
    })
}