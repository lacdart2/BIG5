import { useEffect, useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import UpcomingList from '../components/today/UpcomingList'
import LeagueTabs from '../components/layout/LeagueTabs'
import ScheduleLoading from '../components/ui/ScheduleLoading'
import DateNav from '../components/ui/DateNav'
import { fetchWeekFixtures, scheduleErrorMessage } from '../services/scheduleApi'
import { LEAGUES } from '../types/league'
import type { Match } from '../types/football'

/** Seven days of fixtures, using Today's league filters and fixture presentation. */
function Week() {
    const [allMatches, setAllMatches] = useState<Match[]>([])
    const [dayIndex, setDayIndex] = useState(0)
    const [activeLeagueId, setActiveLeagueId] = useState('all')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [attempt, setAttempt] = useState(0)
    const request = useRef<Promise<Match[]> | null>(null)
    const [dates] = useState(() => Array.from({ length: 7 }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() + index)
        return date.toISOString().slice(0, 10)
    }))

    useEffect(() => {
        let active = true
        request.current ??= fetchWeekFixtures()
        request.current
            .then((result) => { if (active) setAllMatches(result) })
            .catch((error) => { if (active) setError(scheduleErrorMessage(error, 'Could not load the week’s fixtures. Please try again.')) })
            .finally(() => { if (active) setIsLoading(false) })
        return () => { active = false }
    }, [attempt])

    const selectedDate = dates[dayIndex]
    const selectedLeague = LEAGUES.find((league) => league.id === activeLeagueId)
    const matches = allMatches.filter((match) =>
        match.kickoff.slice(0, 10) === selectedDate && (!selectedLeague || match.leagueApiId === selectedLeague.apiId)
    ).sort((a, b) => a.kickoff.localeCompare(b.kickoff))
    const emblems = Object.fromEntries(LEAGUES.map((league) => [
        league.id, allMatches.find((match) => match.leagueApiId === league.apiId && match.competitionEmblem)?.competitionEmblem,
    ]))
    const dateLabel = new Date(`${selectedDate}T12:00:00`).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })

    function retryMatches() {
        request.current = null
        setError(null)
        setIsLoading(true)
        setAttempt((previous) => previous + 1)
    }

    return (
        <div className="pb-4">
            <header className="today-hero border-b border-border px-4 py-6">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-text">Seven days. Five leagues.</p>
                <div className="flex items-center justify-between gap-3">
                    <h1 className="font-display text-3xl font-extrabold tracking-tight">Your football week.</h1>
                    <CalendarDays size={24} className="shrink-0 text-accent-text" aria-hidden="true" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-2">Find your next kickoff. Follow every matchday.</p>
            </header>
            <div className="py-2">
                <LeagueTabs activeId={activeLeagueId} onChange={setActiveLeagueId} emblems={emblems} />
                <DateNav dates={dates} activeIndex={dayIndex} onChange={setDayIndex} />
            </div>
            <div className="space-y-5 px-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                    <time dateTime={selectedDate} className="text-xs font-semibold text-text-2">{dateLabel}</time>
                    <span className="text-xs tabular-nums text-accent-text">{isLoading || error ? '—' : matches.length} matches</span>
                </div>
                <p role="status" aria-atomic="true" className="sr-only">
                    {dateLabel}, {selectedLeague?.name ?? 'all leagues'}: {isLoading ? 'loading fixtures' : error ? 'fixtures unavailable' : `${matches.length} matches`}
                </p>
                <div aria-busy={isLoading}>
                    {isLoading ? (
                        <div className="rounded-2xl border border-border bg-surface-1 p-5">
                            <ScheduleLoading>Preparing your football week…</ScheduleLoading>
                            <div aria-hidden="true" className="mt-4 h-36 animate-pulse rounded-xl bg-surface-2 motion-reduce:animate-none" />
                        </div>
                    ) : error ? (
                        <div role="alert" className="rounded-2xl border border-border bg-surface-1 p-5">
                            <p className="text-sm text-text-2">{error}</p>
                            <button type="button" onClick={retryMatches} className="mt-3 min-h-11 cursor-pointer rounded-full bg-accent/15 px-4 text-sm font-semibold text-accent-text hover:bg-accent/25 focus-visible:outline-2 focus-visible:outline-accent-text">Retry fixtures</button>
                        </div>
                    ) : matches.length === 0 ? (
                        <section className="today-hero rounded-2xl border border-border px-5 py-8">
                            <CalendarDays size={28} aria-hidden="true" className="mb-4 text-accent-text" />
                            <h2 className="text-balance font-display text-2xl font-extrabold tracking-tight">A break between matchdays.</h2>
                            <p className="mt-3 text-sm leading-relaxed text-text-2">No fixtures for {selectedLeague?.name ?? 'the Big Five'} on this date. Use the arrows to explore another day, or choose a different league.</p>
                        </section>
                    ) : <UpcomingList matches={matches} liveHeading="In play" />}
                </div>
            </div>
        </div>
    )
}

export default Week
