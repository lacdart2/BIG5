import { motion, useReducedMotion } from 'framer-motion'
import TeamCrest from '../ui/TeamCrest'
import LiveIndicator from '../ui/LiveIndicator'
import LeagueEmblem from '../ui/LeagueEmblem'
import { useLocale } from '../../i18n/LocaleProvider'
import type { Match } from '../../types/football'

interface FeaturedMatchProps {
    match: Match
    variant?: 'hero' | 'compact'
}

function FeaturedMatch({ match, variant = 'hero' }: FeaturedMatchProps) {
    const reducedMotion = useReducedMotion()
    const { t, competitionName } = useLocale()
    const compact = variant === 'compact'
    const TeamHeading = compact ? 'h4' : 'h3'
    const live = match.status === 'live'
    const kickoff = new Date(match.kickoff).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    return (
        <motion.section
            aria-label={compact ? `${match.homeTeam.name} vs ${match.awayTeam.name}` : t('featured.match')}
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={`overflow-hidden rounded-2xl border bg-surface-1 ${compact ? 'border-border transition-colors duration-150 hover:border-accent/30 motion-reduce:transition-none' : 'border-accent/30'}`}
        >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-accent/5 px-4 py-3">
                {compact ? (
                    <h3 className="text-xs font-semibold text-text-2">
                        {match.matchday != null ? t('featured.matchday', { count: match.matchday }) : competitionName(match.competition)}
                    </h3>
                ) : (
                    <h2 className="text-xs font-bold uppercase tracking-widest text-accent-text">
                        {live ? t('featured.spotlightLive') : t('featured.spotlightNext')}
                    </h2>
                )}
                {live ? <div className="motion-reduce:[&_.animate-pulse]:animate-none"><LiveIndicator minute={match.minute} /></div> : <span className="text-xs font-semibold text-text-2">{t('common.upcoming')}</span>}
            </div>

            <div className={`today-hero px-4 ${compact ? 'py-4' : 'py-6 lg:py-10'}`}>
                {!compact && (
                    <div className="mb-6 flex items-center justify-center gap-2 text-xs text-text-2">
                        <LeagueEmblem src={match.competitionEmblem} label={match.competition} />
                        <span>{competitionName(match.competition)}{match.matchday != null && ` · ${t('featured.matchday', { count: match.matchday })}`}</span>
                    </div>
                )}

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                        <TeamCrest team={match.homeTeam} size={compact ? 36 : 52} />
                        <TeamHeading dir="ltr" className="w-full break-words font-display text-sm font-bold text-text">{match.homeTeam.shortName}</TeamHeading>
                    </div>
                    <div className="text-center tabular-nums" dir="ltr">
                        {live ? (
                            <p className={`flex items-center gap-2 font-display font-extrabold tracking-tighter text-text ${compact ? 'text-4xl' : 'text-5xl sm:text-6xl lg:text-7xl'}`}>
                                <span>{match.homeScore ?? '—'}</span><span className="text-text-2">:</span><span>{match.awayScore ?? '—'}</span>
                            </p>
                        ) : <time dateTime={match.kickoff} className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{kickoff}</time>}
                        {!compact && <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-text-2" dir="auto">{live ? t('featured.matchInProgress') : t('featured.kickoff')}</p>}
                    </div>
                    <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                        <TeamCrest team={match.awayTeam} size={compact ? 36 : 52} />
                        <TeamHeading dir="ltr" className="w-full break-words font-display text-sm font-bold text-text">{match.awayTeam.shortName}</TeamHeading>
                    </div>
                </div>
            </div>

            {live && !compact && <p className="border-t border-border px-4 py-2 text-center text-[11px] text-text-2">{t('featured.scoresDelayed')}</p>}
        </motion.section>
    )
}

export default FeaturedMatch