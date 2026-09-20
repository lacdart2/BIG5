/** null deliberately suppresses outdated API artwork. Set PL to '/emblems/pl.svg' after adding the asset. */
export const LEAGUE_EMBLEM_OVERRIDES: Record<string, string | null> = {}

/** Explicit overrides take precedence, including an intentional monogram fallback. */
export function resolveLeagueEmblem(code: string, apiEmblem?: string | null): string | undefined {
    return Object.hasOwn(LEAGUE_EMBLEM_OVERRIDES, code)
        ? LEAGUE_EMBLEM_OVERRIDES[code] ?? undefined
        : apiEmblem ?? undefined
}
