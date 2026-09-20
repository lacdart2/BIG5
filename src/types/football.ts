/**
 * Core football data types, shared across the app.
 * Real data comes from API-Football in MVP 0.2 — for now we use
 * mock objects shaped exactly like this so swapping in real data
 * later requires no component changes.
 */

export type MatchStatus = 'upcoming' | 'live' | 'finished'

export interface Team {
    id: string
    name: string
    shortName: string
    /** Optional crest image URL. Falls back to a monogram chip if absent. */
    crestUrl?: string
    /** Hex color used for the monogram chip background when no crest exists. */
    colorHex?: string
}

export interface Match {
    id: string
    status: MatchStatus
    /** ISO date string, e.g. "2026-09-14T18:00:00Z" */
    kickoff: string
    /** Match minute — only meaningful when status is "live" */
    minute?: number
    homeTeam: Team
    awayTeam: Team
    homeScore: number | null
    awayScore: number | null
    competition: string
    /** Official competition emblem, when supplied by football-data.org. */
    competitionEmblem?: string
    matchday?: number
    leagueApiId: number
}
