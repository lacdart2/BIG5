import type { Match } from '../../types/football'
import TeamCrest from './TeamCrest'
import LiveIndicator from './LiveIndicator'

/**
 * MatchCard — the core visual unit of BIG5 (design brief section 4).
 * Three-zone layout: status row on top, then home crest+name / score / away crest+name.
 * Handles all three states: upcoming (kickoff time), live (pulsing indicator),
 * finished (muted FT, winner brightened).
 */
function MatchCard({ match }: { match: Match }) {
    const { status, kickoff, minute, homeTeam, awayTeam, homeScore, awayScore } = match

    const isFinished = status === 'finished'
    const homeWon = isFinished && homeScore !== null && awayScore !== null && homeScore > awayScore
    const awayWon = isFinished && homeScore !== null && awayScore !== null && awayScore > homeScore

    const kickoffTime = new Date(kickoff).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <div className="rounded-2xl border border-border bg-surface-1 p-4">
            {/* Status row */}
            <div className="mb-3 flex items-center justify-center">
                {status === 'live' && <LiveIndicator minute={minute} />}
                {status === 'upcoming' && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-text-2 [font-variant-numeric:tabular-nums]">
                        {kickoffTime}
                    </span>
                )}
                {status === 'finished' && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-text-3">
                        FT
                    </span>
                )}
            </div>

            {/* Teams + score */}
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

                <div className="flex shrink-0 items-center gap-2 font-display text-3xl font-extrabold text-text [font-variant-numeric:tabular-nums]">
                    <span>{homeScore ?? '–'}</span>
                    <span className="text-text-3">:</span>
                    <span>{awayScore ?? '–'}</span>
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
        </div>
    )
}

export default MatchCard