import { fetchTodayFixtures, FootballApiError } from './footballApi'
import { fetchTodayFixturesFallback } from './scheduleApi'
import type { Match } from '../types/football'

export interface FixturesResult {
    matches: Match[]
    /** True when API-Football was unavailable and football-data.org was used instead. */
    usedFallback: boolean
}

/**
 * Tries API-Football first (real-time). If it's unavailable (rate limit or
 * plan restriction — the two failure modes we've actually hit), silently
 * retries with football-data.org instead of showing an error. Callers use
 * `usedFallback` to show a "data may be delayed" note when it fires.
 */
export async function fetchTodayFixturesWithFallback(): Promise<FixturesResult> {
    try {
        const matches = await fetchTodayFixtures()
        return { matches, usedFallback: false }
    } catch (err) {
        if (err instanceof FootballApiError) {
            const matches = await fetchTodayFixturesFallback()
            return { matches, usedFallback: true }
        }
        throw err
    }
}