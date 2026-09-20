import type { Match, MatchStatus, Team } from '../types/football'
import { LEAGUES } from '../types/league'
import { resolveLeagueEmblem } from '../utils/leagueEmblems'

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
    competition?: { emblem?: string | null }
    standings?: { table: ScheduleApiStanding[] }[]
}

interface ScheduleApiMatch {
    id: number
    utcDate: string
    status: string
    competition: { id: number; name: string; code: string; emblem?: string | null }
    minute?: number | null
    matchday?: number | null
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
    if (m.competition.emblem) setCached(`schedule-emblem:${m.competition.code}`, m.competition.emblem)
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
        competitionEmblem: resolveLeagueEmblem(m.competition.code, m.competition.emblem),
        minute: m.minute ?? undefined,
        matchday: m.matchday ?? undefined,
        leagueApiId: CODE_TO_CANONICAL_ID[m.competition.code] ?? m.competition.id,
    }
}

// ── Short-lived request cache ────────────────────────────────────────
// Applies in development and production. Pending requests are also shared
// across components and StrictMode effect replays within this browser tab.
const CACHE_TTL_MS = 2 * 60 * 1000 // 2 minutes
const inFlight = new Map<string, Promise<unknown>>()
const retrying = new Set<string>()
const retryListeners = new Set<() => void>()
let cooldownUntil = 0

export class ScheduleRateLimitError extends Error {
    constructor() {
        super('Still catching up. The data provider is busy; please retry in a minute.')
        this.name = 'ScheduleRateLimitError'
    }
}

/** Distinguish exhausted rate-limit retries from other request failures. */
export function scheduleErrorMessage(error: unknown, fallback: string): string {
    return error instanceof ScheduleRateLimitError ? error.message : fallback
}

export function subscribeScheduleRetry(listener: () => void) {
    retryListeners.add(listener)
    return () => { retryListeners.delete(listener) }
}

export function isScheduleRetrying() {
    return retrying.size > 0
}

function setRetrying(url: string, value: boolean) {
    if (value) retrying.add(url)
    else retrying.delete(url)
    retryListeners.forEach((listener) => listener())
}

/** Honor upstream timing when available; otherwise back off for 15 then 30 seconds. */
function retryDelay(response: Response, attempt: number): number {
    const header = response.headers.get('Retry-After')
    const reset = response.headers.get('X-RequestCounter-Reset')
    const seconds = header === null ? NaN : Number(header)
    const dateDelay = header === null ? NaN : Date.parse(header) - Date.now()
    const resetDelay = reset === null ? NaN : Number(reset) * 1000
    const delay = Number.isFinite(seconds) ? seconds * 1000
        : Number.isFinite(dateDelay) ? dateDelay : resetDelay
    return Math.max(1000, Number.isFinite(delay) ? delay : 15000 * 2 ** attempt)
}

async function fetchWithBackoff(url: string): Promise<Response> {
    try {
        for (let attempt = 0; ; attempt++) {
            while (cooldownUntil > Date.now()) {
                setRetrying(url, true)
                await new Promise((resolve) => setTimeout(resolve, Math.min(cooldownUntil - Date.now(), 60000)))
            }
            const response = await fetch(url)
            if (response.status !== 429) return response
            cooldownUntil = Math.max(cooldownUntil, Date.now() + retryDelay(response, attempt))
            if (attempt >= 2) throw new ScheduleRateLimitError()
            setRetrying(url, true)
        }
    } finally {
        setRetrying(url, false)
    }
}

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

/** Reuse competition artwork already returned by fixtures or standings; no extra request. */
export function getLeagueEmblems(): Record<string, string | undefined> {
    return Object.fromEntries(Object.entries(STANDINGS_CODES).map(([id, code]) => [
        id, resolveLeagueEmblem(code, getCached<string>(`schedule-emblem:${code}`)),
    ]))
}

function cachedFetch<T>(url: string, transform: (data: unknown) => T): Promise<T> {
    const cached = getCached<T>(url)
    if (cached !== null) return Promise.resolve(cached)
    const pending = inFlight.get(url)
    if (pending) return pending as Promise<T>

    const request = (async () => {
        const response = await fetchWithBackoff(url)
        if (!response.ok) throw new Error(`Schedule API error: ${response.status}`)
        const result = transform(await response.json())
        setCached(url, result)
        return result
    })().finally(() => { inFlight.delete(url) })
    inFlight.set(url, request)
    return request
}
// ──────────────────────────────────────────────────────────────────────

async function fetchMatchesByDateRange(dateFrom: string, dateTo: string): Promise<Match[]> {
    const url = `/api/schedule?endpoint=matches&dateFrom=${dateFrom}&dateTo=${dateTo}&competitions=${BIG5_CODES.join(',')}`

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

/** Fetches today's fixtures — used by both Today and Live pages. */
export async function fetchTodayFixtures(): Promise<Match[]> {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)

    const todayStr = today.toISOString().slice(0, 10)
    const tomorrowStr = tomorrow.toISOString().slice(0, 10)

    // football-data.org's dateTo appears to be exclusive, so a single-day
    // range (dateFrom === dateTo) returns zero results even when matches
    // exist. Querying today→tomorrow and filtering client-side avoids
    // that boundary issue reliably.
    const matches = await fetchMatchesByDateRange(todayStr, tomorrowStr)
    return matches.filter((m) => m.kickoff.slice(0, 10) === todayStr)
}

export async function fetchStandings(competitionCode: string): Promise<Standing[]> {
    const url = `/api/schedule?endpoint=competitions/${competitionCode}/standings`

    return cachedFetch(url, (data) => {
        const emblem = (data as StandingsResponse).competition?.emblem
        if (emblem) setCached(`schedule-emblem:${competitionCode}`, emblem)
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
