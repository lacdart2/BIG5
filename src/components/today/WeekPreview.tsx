import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import LeagueEmblem from '../ui/LeagueEmblem'
import { LEAGUES } from '../../types/league'
import { useLocale } from '../../i18n/LocaleProvider'
import type { Match } from '../../types/football'

function WeekPreview({ matches, loading, error, emblems }: {
    matches: Match[]
    loading: boolean
    error: string | null
    emblems: Record<string, string | undefined>
}) {
    const { t, competitionName, isRTL } = useLocale()

    return (
        <section aria-labelledby="week-preview-title" className="lg:flex lg:h-full lg:flex-col">
            <div className="mb-2 flex items-center justify-between gap-3">
                <h2 id="week-preview-title" className="font-display text-lg font-bold tracking-tight">{t('weekPreview.title')}</h2>
                <Link to="/week" className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-accent-text hover:text-text focus-visible:outline-2 focus-visible:outline-accent-text">
                    {t('weekPreview.fullSchedule')} <ArrowUpRight size={14} aria-hidden="true" className={isRTL ? '-scale-x-100' : ''} />
                </Link>
            </div>
            <div aria-busy={loading} className="overflow-hidden rounded-2xl border border-border bg-surface-1 lg:flex-1">
                <p className="border-b border-border px-4 py-3 text-xs text-text-2">{t('weekPreview.subtitle')}</p>
                {loading ? <p className="p-4 text-sm text-text-2">{t('weekPreview.loading')}</p> : error ? <p className="p-4 text-sm text-text-2">{t('weekPreview.error')}</p> : (
                    <ul className="divide-y divide-border">
                        {LEAGUES.map((league) => {
                            const count = matches.filter((match) => match.leagueApiId === league.apiId).length
                            return (
                                <li key={league.id} className="flex items-center gap-3 px-4 py-3">
                                    <LeagueEmblem src={emblems[league.id]} label={league.shortName} />
                                    <span className="flex-1 text-sm font-medium">{competitionName(league.name)}</span>
                                    <span className="text-xs tabular-nums text-text-2">{count} {count === 1 ? t('common.match') : t('common.matches')}</span>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </section>
    )
}

export default WeekPreview