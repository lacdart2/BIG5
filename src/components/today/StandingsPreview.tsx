import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import LeagueTabs from '../layout/LeagueTabs'
import StandingsContent from '../ui/StandingsContent'
import { useLeagueStandings } from '../../hooks/useLeagueStandings'
import { getLeagueEmblems } from '../../services/scheduleApi'
import { DOMESTIC_LEAGUES } from '../../types/league'
import { useLocale } from '../../i18n/LocaleProvider'

function StandingsPreview({ emblems }: { emblems: Record<string, string | undefined> }) {
    const [activeId, setActiveId] = useState('pl')
    const state = useLeagueStandings(activeId)
    const league = DOMESTIC_LEAGUES.find((item) => item.id === activeId)!
    const artwork = { ...getLeagueEmblems() }
    const { t, isRTL } = useLocale()

    for (const [id, emblem] of Object.entries(emblems)) {
        if (emblem) artwork[id] = emblem
    }

    return (
        <section aria-labelledby="standings-preview-title" className="lg:flex lg:h-full lg:flex-col">
            <div className="mb-2 flex items-center justify-between gap-3">
                <h2 id="standings-preview-title" className="font-display text-lg font-bold tracking-tight">{t('standingsPreview.title')}</h2>
                <Link to="/standings" className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-accent-text hover:text-text focus-visible:outline-2 focus-visible:outline-accent-text">
                    {t('standingsPreview.full')} <ArrowUpRight size={14} aria-hidden="true" className={isRTL ? '-scale-x-100' : ''} />
                </Link>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-1 lg:flex-1">
                <LeagueTabs activeId={activeId} onChange={setActiveId} showAll={false} emblems={artwork} />
                <StandingsContent leagueName={league.name} {...state} compact />
            </div>
        </section>
    )
}

export default StandingsPreview