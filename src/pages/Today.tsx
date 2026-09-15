import { useEffect, useState } from 'react'
import MatchCard from '../components/ui/MatchCard'
import LeagueTabs from '../components/layout/LeagueTabs'
import { fetchTodayFixtures } from '../services/scheduleApi'
import { LEAGUES } from '../types/league'
import type { Match } from '../types/football'

function Today() {
    const [matches, setMatches] = useState<Match[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeLeagueId, setActiveLeagueId] = useState('all')

    useEffect(() => {
        fetchTodayFixtures()
            .then(setMatches)
            .catch(() => setError('Could not load matches. Please try again.'))
            .finally(() => setIsLoading(false))
    }, [])

    const visibleMatches =
        activeLeagueId === 'all'
            ? matches
            : matches.filter((m) => {
                const league = LEAGUES.find((l) => l.id === activeLeagueId)
                return league && m.leagueApiId === league.apiId
            })

    return (
        <div className="flex flex-col">
            <LeagueTabs activeId={activeLeagueId} onChange={setActiveLeagueId} />

            <div className="flex flex-col gap-3 px-4 pb-4">
                {isLoading && (
                    <p className="py-8 text-center text-sm text-text-3">Loading matches…</p>
                )}

                {!isLoading && error && (
                    <p className="py-8 text-center text-sm text-live">{error}</p>
                )}

                {!isLoading && !error && visibleMatches.length === 0 && (
                    <p className="py-8 text-center text-sm text-text-3">
                        No matches for this league today.
                    </p>
                )}

                {!isLoading &&
                    !error &&
                    visibleMatches.map((match) => <MatchCard key={match.id} match={match} />)}
            </div>
        </div>
    )
}

export default Today