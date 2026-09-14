import { useEffect, useState } from 'react'
import MatchCard from '../components/ui/MatchCard'
import { fetchWeekFixtures } from '../services/scheduleApi'
import type { Match } from '../types/football'

/** Builds the next 7 dates starting today, e.g. ["2026-09-14", "2026-09-15", ...] */
function getWeekDates(): string[] {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() + i)
        return d.toISOString().slice(0, 10)
    })
}

function formatTabLabel(dateStr: string, index: number) {
    if (index === 0) return 'Today'
    const d = new Date(dateStr)
    return d.toLocaleDateString([], { weekday: 'short' })
}

const WEEK_DATES = getWeekDates()

function Week() {
    const [allMatches, setAllMatches] = useState<Match[]>([])
    const [selectedDate, setSelectedDate] = useState(WEEK_DATES[0])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // One request for the whole week — every tab switch below is free.
    useEffect(() => {
        fetchWeekFixtures()
            .then(setAllMatches)
            .catch(() => setError('Could not load matches. Please try again.'))
            .finally(() => setIsLoading(false))
    }, [])

    const matches = allMatches.filter((m) => m.kickoff.slice(0, 10) === selectedDate)

    return (
        <div className="flex flex-col">
            <div role="group" aria-label="Filter by date" className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
                {WEEK_DATES.map((date, i) => {
                    const isActive = date === selectedDate
                    return (
                        <button
                            key={date}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => setSelectedDate(date)}
                            className={`min-h-11 shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text motion-reduce:transition-none
                ${isActive ? 'bg-accent/15 text-accent-text hover:bg-accent/25 active:bg-accent/30' : 'bg-surface-2 text-text-2 hover:bg-surface-3 hover:text-text active:bg-accent/15 active:text-accent-text'}`}
                        >
                            {formatTabLabel(date, i)}
                        </button>
                    )
                })}
            </div>

            <div className="flex flex-col gap-3 px-4 pb-4">
                {isLoading && (
                    <p className="py-8 text-center text-sm text-text-3">Loading matches…</p>
                )}

                {!isLoading && error && (
                    <p className="py-8 text-center text-sm text-live">{error}</p>
                )}

                {!isLoading && !error && matches.length === 0 && (
                    <p className="py-8 text-center text-sm text-text-3">
                        No Big 5 matches this day.
                    </p>
                )}

                {!isLoading &&
                    !error &&
                    matches.map((match) => <MatchCard key={match.id} match={match} />)}
            </div>
        </div>
    )
}

export default Week
