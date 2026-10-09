import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Radio } from 'lucide-react'
import FeaturedMatch from '../components/today/FeaturedMatch'
import LeagueTabs from '../components/layout/LeagueTabs'
import ScheduleLoading from '../components/ui/ScheduleLoading'
import LeagueEmblem from '../components/ui/LeagueEmblem'
import { fetchTodayFixtures, scheduleErrorMessage } from '../services/scheduleApi'
import { LEAGUES } from '../types/league'
import type { Match } from '../types/football'
import { useLocale } from '../i18n/LocaleProvider'

/** Live fixtures grouped by league, using the same score cards as Today. */
function Live() {
    const { t, competitionName } = useLocale()
    const [matches, setMatches] = useState<Match[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeLeagueId, setActiveLeagueId] = useState('all')
    const [attempt, setAttempt] = useState(0)
    const request = useRef<Promise<Match[]> | null>(null)

    useEffect(() => {
        let active = true
        request.current ??= fetchTodayFixtures()
        request.current
            .then((result) => { if (active) setMatches(result) })
            .catch((error) => { if (active) setError(scheduleErrorMessage(error, 'Could not load live matches. Please try again.')) })
            .finally(() => { if (active) setIsLoading(false) })
        return () => { active = false }
    }, [attempt])

    const emblems = Object.fromEntries(LEAGUES.map((league) => [
        league.id, matches.find((match) => match.leagueApiId === league.apiId && match.competitionEmblem)?.competitionEmblem,
    ]))
    const selectedLeague = LEAGUES.find((league) => league.id === activeLeagueId)
    const groups = LEAGUES
        .filter((league) => !selectedLeague || league.id === selectedLeague.id)
        .map((league) => ({
            league,
            matches: matches.filter((match) => match.status === 'live' && match.leagueApiId === league.apiId)
                .sort((a, b) => a.kickoff.localeCompare(b.kickoff)),
        }))
        .filter((group) => group.matches.length > 0)
    const liveCount = groups.reduce((total, group) => total + group.matches.length, 0)

    function retryMatches() {
        request.current = null
        setError(null)
        setIsLoading(true)
        setAttempt((previous) => previous + 1)
    }

    return (
        <div className="mx-auto w-full max-w-xl pb-4">
            <header className="today-hero border-b border-border px-4 py-6">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-text">{t('live.kicker')}</p>
                <div className="flex items-center justify-between gap-3">
                    <h1 className="font-display text-3xl font-extrabold tracking-tight">{t('live.title')}</h1>
                    <Radio size={24} aria-hidden="true" className={liveCount > 0 ? 'text-live' : 'text-text-2'} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-2">{t('live.subtitle')}</p>
            </header>
            <LeagueTabs activeId={activeLeagueId} onChange={setActiveLeagueId} emblems={emblems} />
            <div className="space-y-5 px-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-xs text-text-2">
                    <p role="status" aria-atomic="true">
                        {isLoading ? t('live.checking') : error ? t('live.unavailable') : `${liveCount} ${liveCount === 1 ? t('common.match') : t('common.matches')} · ${t('common.live')} · ${selectedLeague ? competitionName(selectedLeague.name) : t('common.allCompetitions')}`}
                    </p>
                    <span>{t('live.delayed')}</span>
                </div>
                <div aria-busy={isLoading} className="space-y-6">
                    {isLoading ? (
                        <div className="rounded-2xl border border-border bg-surface-1 p-5">
                            <ScheduleLoading>{t('live.loading')}</ScheduleLoading>
                            <div aria-hidden="true" className="mt-4 h-28 animate-pulse rounded-xl bg-surface-2 motion-reduce:animate-none" />
                        </div>
                    ) : error ? (
                        <div role="alert" className="rounded-2xl border border-border bg-surface-1 p-5">
                            <p className="text-sm text-text-2">{error}</p>
                            <button type="button" onClick={retryMatches} className="mt-3 min-h-11 cursor-pointer rounded-full bg-accent/15 px-4 text-sm font-semibold text-accent-text hover:bg-accent/25 focus-visible:outline-2 focus-visible:outline-accent-text">{t('live.retry')}</button>
                        </div>
                    ) : liveCount === 0 ? (
                        <section className="today-hero rounded-2xl border border-border px-5 py-8">
                            <div aria-hidden="true" className="mb-5 flex size-12 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-accent-text"><Radio size={24} /></div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-accent-text">{t('live.between')}</p>
                            <h2 className="mt-2 text-balance font-display text-2xl font-extrabold tracking-tight">{t('live.none')}</h2>
                            <p className="mt-3 max-w-80 text-sm leading-relaxed text-text-2">
                                {selectedLeague ? `No ${selectedLeague.name} matches are in play. Check another league or see the next kickoffs.` : 'The next kickoff is worth the wait. Explore today’s fixtures or plan your football week.'}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent/15 px-4 text-sm font-semibold text-accent-text hover:bg-accent/25 focus-visible:outline-2 focus-visible:outline-accent-text">{t('live.todayFixtures')} <ArrowUpRight size={16} aria-hidden="true" /></Link>
                                <Link to="/week" className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-text-2 hover:text-text focus-visible:outline-2 focus-visible:outline-accent-text">{t('live.viewWeek')}</Link>
                            </div>
                        </section>
                    ) : groups.map(({ league, matches: fixtures }) => (
                        <section key={league.id} aria-labelledby={`live-league-${league.id}`}>
                            <div className="mb-3 flex items-center gap-2">
                                <LeagueEmblem src={emblems[league.id]} label={league.shortName} />
                                <h2 id={`live-league-${league.id}`} className="flex-1 font-display text-base font-bold">{competitionName(league.name)}</h2>
                                <span className="text-xs tabular-nums text-text-2">{fixtures.length} {t('common.live')}</span>
                            </div>
                            <div className="space-y-3">
                                {fixtures.map((match) => <FeaturedMatch key={match.id} match={match} variant="compact" />)}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Live
