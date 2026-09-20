import { motion, useReducedMotion } from 'framer-motion'
import TeamCrest from '../ui/TeamCrest'
import LiveIndicator from '../ui/LiveIndicator'
import LeagueEmblem from '../ui/LeagueEmblem'
import type { Match } from '../../types/football'

interface FeaturedMatchProps {
    match: Match
    /** Compact cards can repeat in Live's league groups; Today keeps the hero default. */
    variant?: 'hero' | 'compact'
}

/** Shared score presentation for a featured fixture or a compact live-match list. */
function FeaturedMatch({ match, variant = 'hero' }: FeaturedMatchProps) {
    const reducedMotion = useReducedMotion()
    const compact = variant === 'compact'
    const TeamHeading = compact ? 'h4' : 'h3'
    const live = match.status === 'live'
    const kickoff = new Date(match.kickoff).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    return (
        <motion.section
            aria-label={compact ? `${match.homeTeam.name} vs ${match.awayTeam.name}` : 'Featured match'}
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={`overflow-hidden rounded-2xl border bg-surface-1 ${compact ? 'border-border transition-colors duration-150 hover:border-accent/30 motion-reduce:transition-none' : 'border-accent/30'}`}
        >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-accent/5 px-4 py-3">
                {compact ? (
                    <h3 className="text-xs font-semibold text-text-2">
                        {match.matchday != null ? `Matchday ${match.matchday}` : match.competition}
                    </h3>
                ) : (
                    <h2 className="text-xs font-bold uppercase tracking-widest text-accent-text">{live ? 'In the spotlight' : 'Next in the spotlight'}</h2>
                )}
                {live ? (
                    <div className="motion-reduce:[&_.animate-pulse]:animate-none">
                        <LiveIndicator minute={match.minute} />
                    </div>
                ) : <span className="text-xs font-semibold text-text-2">Upcoming</span>}
            </div>
            <div className={`today-hero px-4 ${compact ? 'py-4' : 'py-6'}`}>
                {!compact && <div className="mb-6 flex items-center justify-center gap-2 text-xs text-text-2">
                    <LeagueEmblem src={match.competitionEmblem} label={match.competition} />
                    <span>{match.competition}{match.matchday != null && ` · Matchday ${match.matchday}`}</span>
                </div>}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                        <TeamCrest team={match.homeTeam} size={compact ? 36 : 52} />
                        <TeamHeading className="w-full break-words font-display text-sm font-bold text-text">{match.homeTeam.shortName}</TeamHeading>
                    </div>
                    <div className="text-center tabular-nums">
                        {live ? (
                            <p aria-label={`Score ${match.homeScore ?? 'unavailable'} to ${match.awayScore ?? 'unavailable'}`} className={`flex items-center gap-2 font-display font-extrabold tracking-tighter text-text ${compact ? 'text-4xl' : 'text-5xl sm:text-6xl'}`}>
                                <span>{match.homeScore ?? '—'}</span><span className="text-text-2">:</span><span>{match.awayScore ?? '—'}</span>
                            </p>
                        ) : <time dateTime={match.kickoff} className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{kickoff}</time>}
                        {!compact && <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-text-2">{live ? 'Match in progress' : 'Kickoff'}</p>}
                    </div>
                    <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                        <TeamCrest team={match.awayTeam} size={compact ? 36 : 52} />
                        <TeamHeading className="w-full break-words font-display text-sm font-bold text-text">{match.awayTeam.shortName}</TeamHeading>
                    </div>
                </div>
            </div>
            {live && !compact && <p className="border-t border-border px-4 py-2 text-center text-[11px] text-text-2">Scores may be delayed by the data provider.</p>}
        </motion.section>
    )
}

export default FeaturedMatch
