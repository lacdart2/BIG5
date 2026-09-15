import { useEffect, useState } from 'react'
import MatchCard from '../components/ui/MatchCard'
import { fetchTodayFixtures } from '../services/scheduleApi'
import type { Match } from '../types/football'

/**
 * Live — reuses today's fixtures, filtered to matches currently in
 * progress. NOTE: football-data.org's free tier is delayed, not
 * real-time — live status/minute will lag actual play slightly.
 */
function Live() {
    const [matches, setMatches] = useState<Match[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchTodayFixtures()
            .then((all) => setMatches(all.filter((m) => m.status === 'live')))
            .catch(() => setError('Could not load matches. Please try again.'))
            .finally(() => setIsLoading(false))
    }, [])

    return (
        <div className="flex flex-col gap-3 p-4">
            <h1 className="font-display text-2xl font-bold text-text">Live</h1>

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