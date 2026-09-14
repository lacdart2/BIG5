import { motion } from 'framer-motion'
import type { Match } from '../../types/football'
import TeamCrest from './TeamCrest'
import LiveIndicator from './LiveIndicator'

const cardTransition = { duration: 0.18, ease: [0.2, 0, 0, 1] as const }

/**
 * MatchCard — the core visual unit of BIG5.
 * Now animated with framer-motion: cards fade/rise in on mount, and
 * compress slightly on press — small, deliberate motion per our
 * design system's "broadcast energy" spec (snappy, never slow fades).
 */
function MatchCard({ match }: { match: Match }) {
    const { status, kickoff, minute, homeTeam, awayTeam, homeScore, awayScore } = match

    const isFinished = status === 'finished'
    const isUpcoming = status === 'upcoming'
    const homeWon = isFinished && homeScore !== null && awayScore !== null && homeScore > awayScore
    const awayWon = isFinished && homeScore !== null && awayScore !== null && awayScore > homeScore

    const kickoffTime = new Date(kickoff).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            transition={cardTransition}
            className="rounded-2xl border border-border bg-surface-1 p-4"
        >
            {/* Status row — fixed height so upcoming cards don't shrink vs live/finished */}
            <div className="mb-3 flex h-5 items-center justify-center">
                {status === 'live' && <LiveIndicator minute={minute} />}
                {status === 'finished' && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-text-3">
                        FT
                    </span>
                )}
            </div>

            {/* Teams + score/kickoff */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex flex-1 items-center gap-2">
                    <TeamCrest team={homeTeam} />
                    <span
                        className={`truncate text-sm font-semibold ${isFinished && !homeWon ? 'text-text-3' : 'text-text'
                            }`}
                    >
                        {homeTeam.shortName}
                    </span>
                </div>

                <div className="flex shrink-0 items-center justify-center [font-variant-numeric:tabular-nums]">
                    {isUpcoming ? (
                        <span className="text-base font-semibold text-text-2">{kickoffTime}</span>
                    ) : (
                        <div className="flex items-center gap-2 font-display text-3xl font-extrabold text-text">
                            <span>{homeScore}</span>
                            <span className="text-text-3">:</span>
                            <span>{awayScore}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-1 items-center justify-end gap-2">
                    <span
                        className={`truncate text-sm font-semibold ${isFinished && !awayWon ? 'text-text-3' : 'text-text'
                            }`}
                    >
                        {awayTeam.shortName}
                    </span>
                    <TeamCrest team={awayTeam} />
                </div>
            </div>
        </motion.div>
    )
}

export default MatchCard