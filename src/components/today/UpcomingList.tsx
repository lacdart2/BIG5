import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import TeamCrest from '../ui/TeamCrest'
import LiveIndicator from '../ui/LiveIndicator'
import BroadcastInfo from '../ui/BroadcastInfo'
import { useLocale } from '../../i18n/LocaleProvider'
import type { Match } from '../../types/football'

type MatchStatusFilter = 'live' | 'upcoming' | 'finished'

function UpcomingList({
    matches,
    liveHeading,
    statuses = ['live', 'upcoming', 'finished'],
}: {
    matches: Match[]
    liveHeading?: string
    statuses?: MatchStatusFilter[]
}) {
    const PREVIEW_LIMIT = 4
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})
    const { t, competitionName } = useLocale()

    const groups = [
        { title: liveHeading ?? t('upcoming.alsoLive'), status: 'live' },
        { title: t('upcoming.comingUp'), status: 'upcoming' },
        { title: t('upcoming.fullTime'), status: 'finished' },
    ] as const

    const visibleGroups = groups.filter((group) => statuses.includes(group.status))

    return (
        <div className="space-y-6">
            {visibleGroups.map(({ title, status }) => {
                const fixtures = matches.filter((match) => match.status === status)
                const isExpanded = expanded[status] ?? false
                const visibleFixtures = isExpanded ? fixtures : fixtures.slice(0, PREVIEW_LIMIT)
                if (!fixtures.length) return null

                return (
                    <section key={status} aria-label={title}>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
                            <span className="text-xs tabular-nums text-text-2">
                                {fixtures.length} {fixtures.length === 1 ? t('common.match') : t('common.matches')}
                            </span>
                        </div>

                        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface-1">
                            {visibleFixtures.map((match) => (
                                <li key={match.id}>
                                    <Link to={`/match/${match.id}`} className="flex items-center gap-3 px-4 py-4 transition-colors duration-150 hover:bg-surface-2 motion-reduce:transition-none">
                                    <div className="w-16 shrink-0 text-center text-xs font-semibold tabular-nums text-text-2" dir="ltr">
                                        {status === 'upcoming' ? (
                                            <time dateTime={match.kickoff}>
                                                {new Date(match.kickoff).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </time>
                                        ) : status === 'live' ? (
                                            <div className="motion-reduce:[&_.animate-pulse]:animate-none"><LiveIndicator minute={match.minute} /></div>
                                        ) : 'FT'}
                                    </div>

                                    <div className="min-w-0 flex-1 border-s border-border ps-3">
                                        <div className="mb-2 flex min-w-0 items-center justify-between gap-2">
                                            <p className="min-w-0 truncate text-[11px] text-text-2">{competitionName(match.competition)}</p>
                                            <BroadcastInfo match={match} />
                                        </div>
                                        {[match.homeTeam, match.awayTeam].map((team, index) => (
                                            <div key={`${team.id}-${index}`} className="flex min-h-8 items-center gap-2">
                                                <TeamCrest team={team} size={22} />
                                                <span dir="ltr" className="min-w-0 flex-1 text-sm font-medium">{team.shortName}</span>
                                                {status !== 'upcoming' && (
                                                    <span dir="ltr" className="font-display text-base font-bold tabular-nums">
                                                        {(index === 0 ? match.homeScore : match.awayScore) ?? '—'}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {fixtures.length > PREVIEW_LIMIT && (
                            <button
                                type="button"
                                onClick={() => setExpanded((current) => ({ ...current, [status]: !isExpanded }))}
                                aria-expanded={isExpanded}
                                className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-1 text-xs font-semibold text-text-2 transition-colors duration-150 hover:bg-surface-2 hover:text-text focus-visible:outline-2 focus-visible:outline-accent-text"
                            >
                                {isExpanded ? (
                                    <>{t('common.showLess')}<ChevronUp size={15} aria-hidden="true" /></>
                                ) : (
                                    <>{t('common.showMore', { count: fixtures.length - PREVIEW_LIMIT })}<ChevronDown size={15} aria-hidden="true" /></>
                                )}
                            </button>
                        )}
                    </section>
                )
            })}
        </div>
    )
}

export default UpcomingList