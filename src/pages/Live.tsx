import { useEffect, useState } from 'react'
import MatchCard from '../components/ui/MatchCard'
import { fetchTodayFixturesWithFallback } from '../services/fixturesService'
import type { Match } from '../types/football'

/**
 * Live — reuses the same fallback-aware fetch as Today, filtered to
 * matches currently in progress.
 */
function Live() {
    const [matches, setMatches] = useState<Match[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [usedFallback, setUsedFallback] = useState(false)

    useEffect(() => {
        fetchTodayFixturesWithFallback()
            .then(({ matches, usedFallback }) => {
                setMatches(matches.filter((m) => m.status === 'live'))
                setUsedFallback(usedFallback)
            })
            .catch(() => setError('Could not load matches. Please try again.'))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <div className="flex flex-col gap-3 p-4">
            <h1 className="font-display text-2xl font-bold text-text">Live</h1>

            {usedFallback && !isLoading && !error && (
                <p className="text-[11px] text-text-3">Data may be delayed</p>
            )}

            {isLoading && (
                <p className="py-8 text-center text-sm text-text-3">Loading matches…</p>
            )}

            {!isLoading && error && (
                <p className="py-8 text-center text-sm text-live">{error}</p>
            )}

            {!isLoading && !error && matches.length === 0 && (
                <p className="py-8 text-center text-sm text-text-3">
                    No Big 5 matches live right now.
                </p>
            )}

            {!isLoading &&
                !error &&
                matches.map((match) => <MatchCard key={match.id} match={match} />)}
        </div>
    )
}

export default Live