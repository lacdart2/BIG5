import { useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import LeagueTabs from '../components/layout/LeagueTabs'
import ScheduleLoading from '../components/ui/ScheduleLoading'
import Hero from '../components/today/Hero'
import StatsStrip from '../components/today/StatsStrip'
import FeaturedMatch from '../components/today/FeaturedMatch'
import UpcomingList from '../components/today/UpcomingList'
import StandingsPreview from '../components/today/StandingsPreview'
import WeekPreview from '../components/today/WeekPreview'
import PromoPanel from '../components/today/PromoPanel'
import { fetchWeekFixtures, scheduleErrorMessage } from '../services/scheduleApi'
import { LEAGUES } from '../types/league'
import type { Match } from '../types/football'

/** Matchday home: one fixture response powers the selected day and week preview. */
function Today() {
    const [matches, setMatches] = useState<Match[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeLeagueId, setActiveLeagueId] = useState('all')
    const [dayIndex, setDayIndex] = useState(0)
    const [attempt, setAttempt] = useState(0)
    const [loadedAt, setLoadedAt] = useState(() => Date.now())
    const request = useRef<Promise<Match[]> | null>(null)
    const [dates] = useState(() => Array.from({ length: 7 }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() + index)
        return date.toISOString().slice(0, 10)
    }))

    useEffect(() => {
        let active = true
        // Reuse the pending request during React StrictMode's effect replay.
        request.current ??= fetchWeekFixtures()
        request.current
            .then((result) => {
                if (active) {
                    setMatches(result)
                    setLoadedAt(Date.now())
                }
            })
            .catch((error) => { if (active) setError(scheduleErrorMessage(error, 'Could not load fixtures. Please try again.')) })
            .finally(() => { if (active) setIsLoading(false) })
        return () => { active = false }
    }, [attempt])

    const selectedDate = dates[dayIndex]
    const selectedLeague = LEAGUES.find((league) => league.id === activeLeagueId)
    const weekMatches = matches.filter((match) => dates.includes(match.kickoff.slice(0, 10)))
    const visibleMatches = weekMatches.filter((match) =>
        match.kickoff.slice(0, 10) === selectedDate && (!selectedLeague || match.leagueApiId === selectedLeague.apiId)
    ).sort((a, b) => a.kickoff.localeCompare(b.kickoff))
    const featured = visibleMatches.find((match) => match.status === 'live')
        ?? visibleMatches.find((match) => match.status === 'upcoming' && new Date(match.kickoff).getTime() >= loadedAt)
    const emblems = Object.fromEntries(LEAGUES.map((league) => [
        league.id, matches.find((match) => match.leagueApiId === league.apiId && match.competitionEmblem)?.competitionEmblem,
    ]))
    const dateLabel = `${dayIndex === 0 ? 'Today · ' : ''}${new Date(`${selectedDate}T12:00:00`).toLocaleDateString([], { month: 'short', day: 'numeric' })}`
    const arrowClass = 'flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-1 text-text-2 transition-colors hover:bg-surface-3 hover:text-text active:bg-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text disabled:cursor-default disabled:opacity-30 motion-reduce:transition-none'

    function retryFixtures() {
        request.current = null
        setError(null)
        setIsLoading(true)
        setAttempt((previous) => previous + 1)
    }

    return (
        <div className="pb-4">
            <Hero />
            <div className="py-2">
                <LeagueTabs activeId={activeLeagueId} onChange={setActiveLeagueId} emblems={emblems} />
                <div role="group" aria-label="Fixture date" className="flex items-center justify-between gap-3 px-4 pb-3">
                    <button type="button" aria-label="Previous day" disabled={dayIndex === 0} onClick={() => setDayIndex((previous) => previous - 1)} className={arrowClass}><ChevronLeft size={18} aria-hidden="true" /></button>
                    <div className="flex items-center gap-2 text-sm font-semibold"><CalendarDays size={16} className="text-accent-text" aria-hidden="true" /><time dateTime={selectedDate}>{dateLabel}</time></div>
                    <button type="button" aria-label="Next day" disabled={dayIndex === dates.length - 1} onClick={() => setDayIndex((previous) => previous + 1)} className={arrowClass}><ChevronRight size={18} aria-hidden="true" /></button>
                </div>
            </div>
            <div className="space-y-6 px-4">
                <StatsStrip date={selectedDate} matches={visibleMatches} pending={isLoading || !!error} />
                <p role="status" aria-atomic="true" className="sr-only">{dateLabel}, {selectedLeague?.name ?? 'all leagues'}: {isLoading ? 'loading fixtures' : error ? 'fixtures unavailable' : `${visibleMatches.length} matches`}</p>
                <div aria-busy={isLoading} className="space-y-6">
                    {isLoading ? (
                        <div className="rounded-2xl border border-border bg-surface-1 p-5">
                            <ScheduleLoading>Preparing your matchday…</ScheduleLoading>
                            <div aria-hidden="true" className="mt-5 h-36 animate-pulse rounded-xl bg-surface-2 motion-reduce:animate-none" />
                        </div>
                    ) : error ? (
                        <div role="alert" className="rounded-2xl border border-border bg-surface-1 p-5">
                            <p className="text-sm text-text-2">{error}</p>
                            <button type="button" onClick={retryFixtures} className="mt-3 min-h-11 cursor-pointer rounded-full bg-accent/15 px-4 text-sm font-semibold text-accent-text hover:bg-accent/25 focus-visible:outline-2 focus-visible:outline-accent-text">Retry fixtures</button>
                        </div>
                    ) : visibleMatches.length === 0 ? (
                        <div className="rounded-2xl border border-border bg-surface-1 p-6">
                            <h2 className="font-display text-lg font-bold">A quiet day on the pitch.</h2>
                            <p className="mt-2 text-sm leading-relaxed text-text-2">No fixtures for {selectedLeague?.name ?? 'the Big Five'} on this date. Browse another day or league to see what’s coming up.</p>
                        </div>
                    ) : (
                        <>
                            {featured && <FeaturedMatch key={featured.id} match={featured} />}
                            <UpcomingList matches={visibleMatches.filter((match) => match.id !== featured?.id)} />
                        </>
                    )}
                </div>
                <StandingsPreview emblems={emblems} />
                <WeekPreview matches={weekMatches} loading={isLoading} error={error} emblems={emblems} />
                <PromoPanel />
            </div>
        </div>
    )
}

export default Today
