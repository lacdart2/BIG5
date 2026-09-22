import { useEffect, useRef, useState } from 'react'
import type { TouchEvent } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react'
import LeagueTabs from '../components/layout/LeagueTabs'
import LeagueEmblem from '../components/ui/LeagueEmblem'
import StandingsContent from '../components/ui/StandingsContent'
import { useLeagueStandings } from '../hooks/useLeagueStandings'
import { DOMESTIC_DOMESTIC_LEAGUES } from '../types/league'
import { getLeagueEmblems, STANDINGS_CODES } from '../services/scheduleApi'

/** Capture the starting scroll position so a swipe never steals table scrolling. */
interface LeagueSwipe {
    x: number
    y: number
    canGoNext: boolean
    canGoPrevious: boolean
}

/** The full standings page reuses the preview's table and lazy fetching. */
function Standings() {
    const [selection, setSelection] = useState({ id: 'pl', direction: 1, revision: 0 })
    const activeLeagueId = selection.id
    const activeIndex = DOMESTIC_LEAGUES.findIndex((league) => league.id === activeLeagueId)
    const activeLeague = DOMESTIC_LEAGUES[activeIndex]
    const [reduceMotion, setReduceMotion] = useState(() =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
    const swipe = useRef<LeagueSwipe | null>(null)
    const state = useLeagueStandings(activeLeagueId)
    const emblems = getLeagueEmblems()

    // Respect accessibility changes made while the page is already open.
    useEffect(() => {
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
        const updatePreference = () => setReduceMotion(preference.matches)
        preference.addEventListener('change', updatePreference)
        return () => preference.removeEventListener('change', updatePreference)
    }, [])

    /** Both button and gesture navigation share direction and animation state. */
    function selectLeague(id: string) {
        setSelection((previous) => {
            if (previous.id === id) return previous
            const previousIndex = DOMESTIC_LEAGUES.findIndex((league) => league.id === previous.id)
            const nextIndex = DOMESTIC_LEAGUES.findIndex((league) => league.id === id)
            if (nextIndex < 0) return previous
            return { id, direction: nextIndex > previousIndex ? 1 : -1, revision: previous.revision + 1 }
        })
    }

    function changeLeague(direction: number) {
        const nextLeague = DOMESTIC_LEAGUES[activeIndex + direction]
        if (nextLeague) selectLeague(nextLeague.id)
    }

    function startSwipe(event: TouchEvent<HTMLDivElement>) {
        swipe.current = null
        if (event.touches.length !== 1 || !(event.target instanceof Element)) return
        if (event.target.closest('button, a')) return
        const scrollRegion = event.target.closest<HTMLElement>('[data-standings-scroll]')
        const touch = event.touches[0]
        swipe.current = {
            x: touch.clientX,
            y: touch.clientY,
            canGoNext: !scrollRegion || scrollRegion.scrollLeft + scrollRegion.clientWidth >= scrollRegion.scrollWidth - 2,
            canGoPrevious: !scrollRegion || scrollRegion.scrollLeft <= 2,
        }
    }

    function moveSwipe(event: TouchEvent<HTMLDivElement>) {
        const start = swipe.current
        if (!start) return
        // Lock out vertical scrolling and pinch zoom for the rest of this gesture.
        if (event.touches.length !== 1) {
            swipe.current = null
            return
        }
        const touch = event.touches[0]
        const dx = Math.abs(touch.clientX - start.x)
        const dy = Math.abs(touch.clientY - start.y)
        if (dy > 12 && dy > dx) swipe.current = null
    }

    function endSwipe(event: TouchEvent<HTMLDivElement>) {
        const start = swipe.current
        swipe.current = null
        if (!start || event.changedTouches.length !== 1) return
        const touch = event.changedTouches[0]
        const dx = touch.clientX - start.x
        const dy = touch.clientY - start.y
        if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
        if (dx < 0 && start.canGoNext) changeLeague(1)
        if (dx > 0 && start.canGoPrevious) changeLeague(-1)
    }

    return (
        <div className="mx-auto w-full max-w-xl space-y-6 bg-bg p-4">
            <header className="today-hero -mx-4 -mt-4 space-y-2 border-b border-border px-4 py-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent-text">
                    The season in numbers
                </p>
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-text">
                    Standings<span className="text-accent">.</span>
                </h1>
                <p className="text-sm text-text-2">Every point counts. Follow the race to the top.</p>
            </header>

            <div className="-mx-4">
                <LeagueTabs activeId={activeLeagueId} onChange={selectLeague} showAll={false} emblems={emblems} />
            </div>

            <div
                onTouchStart={startSwipe}
                onTouchMove={moveSwipe}
                onTouchEnd={endSwipe}
                onTouchCancel={() => { swipe.current = null }}
                className="space-y-3"
            >
                <div className="flex touch-pan-y items-center justify-between gap-3">
                    <button
                        type="button"
                        aria-label="Previous league"
                        disabled={activeIndex === 0}
                        onClick={() => changeLeague(-1)}
                        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-1 text-text-2 transition-colors duration-150 hover:bg-surface-3 hover:text-text focus-visible:outline-2 focus-visible:outline-accent-text disabled:cursor-default disabled:opacity-30 motion-reduce:transition-none"
                    >
                        <ChevronLeft size={18} aria-hidden="true" />
                    </button>
                    <div className="space-y-1 text-center">
                        <p className="text-xs font-medium text-text-2 sm:hidden">Swipe header to change league</p>
                        <p className="text-xs font-medium text-text-2">
                            <span className="font-display font-bold tabular-nums text-accent-text">{activeIndex + 1}</span>
                            <span className="mx-1.5">/</span>{DOMESTIC_LEAGUES.length} leagues
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Next league"
                        disabled={activeIndex === DOMESTIC_LEAGUES.length - 1}
                        onClick={() => changeLeague(1)}
                        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-1 text-text-2 transition-colors duration-150 hover:bg-surface-3 hover:text-text focus-visible:outline-2 focus-visible:outline-accent-text disabled:cursor-default disabled:opacity-30 motion-reduce:transition-none"
                    >
                        <ChevronRight size={18} aria-hidden="true" />
                    </button>
                </div>

                <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                    {activeLeague.name}, league {activeIndex + 1} of {DOMESTIC_LEAGUES.length}
                </p>

                {/* Mount only the selected table so rapid swipes never leave stale content. */}
                <div className="overflow-hidden rounded-2xl">
                    <motion.div
                        key={selection.revision}
                        initial={selection.revision === 0 || reduceMotion ? false : { x: selection.direction * 28, opacity: 0.65 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.2, 0, 0, 1] }}
                        className="relative"
                    >
                        <section aria-labelledby="standings-league-title" className="overflow-hidden rounded-2xl border border-border bg-surface-1">
                            <div className="flex touch-pan-y items-center gap-3 p-4">
                                <LeagueEmblem code={STANDINGS_CODES[activeLeagueId]} src={emblems[activeLeagueId]} label={activeLeague.shortName} />
                                <div className="flex-1">
                                    <p className="text-[11px] uppercase tracking-widest text-text-2">{activeLeague.country}</p>
                                    <h2 id="standings-league-title" className="font-display text-lg font-bold">{activeLeague.name}</h2>
                                </div>
                                <Trophy size={20} aria-hidden="true" className="text-accent-text" />
                            </div>
                            <StandingsContent leagueName={activeLeague.name} {...state} />
                        </section>
                        {selection.revision > 0 && !reduceMotion && (
                            <motion.div
                                aria-hidden="true"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.7, 0] }}
                                transition={{ duration: 1, times: [0, 0.15, 1], ease: 'easeOut' }}
                                className={`pointer-events-none absolute inset-x-0 top-0 h-64 rounded-t-2xl from-accent/10 via-accent/5 to-transparent ${selection.direction > 0 ? 'bg-gradient-to-l' : 'bg-gradient-to-r'}`}
                            />
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Standings
