import { useState } from 'react'
import TeamCrest from './TeamCrest'
import type { Team } from '../../types/football'
import type { Standing } from '../../services/scheduleApi'

/** Keep remote crest failures readable in both standings views. */
function StandingCrest({ team }: { team: Team }) {
    const [failed, setFailed] = useState(false)
    return (
        <span aria-hidden="true" className="shrink-0" onErrorCapture={() => setFailed(true)}>
            <TeamCrest team={failed ? { ...team, crestUrl: undefined } : team} size={22} />
        </span>
    )
}

/** One table treatment: top-five preview or full standings with scrollable statistics. */
function StandingsTable({ rows, leagueName, compact = false }: { rows: Standing[]; leagueName: string; compact?: boolean }) {
    const visible = compact ? rows.slice(0, 5) : rows
    return (
        <div>
            {!compact && <p className="px-4 py-3 text-xs text-text-2">{rows.length} clubs · Scroll horizontally for all stats →</p>}
            <div data-standings-scroll={!compact || undefined} role="region" aria-label={`${leagueName} standings table`} tabIndex={compact ? undefined : 0} className="overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-text">
                <table className={`w-full table-fixed text-sm tabular-nums ${compact ? '' : 'min-w-[640px]'}`}>
                    <caption className="px-4 py-3 text-left text-xs font-semibold text-text-2">{leagueName} · {compact ? 'Top five' : 'League table'}</caption>
                    <thead className="border-y border-border bg-surface-2 text-[10px] uppercase tracking-wider text-text-2">
                        <tr>
                            <th scope="col" aria-label="Position" className="w-10 py-2">#</th>
                            <th scope="col" className="text-left">Club</th>
                            <th scope="col" aria-label="Played" className="w-10">P</th>
                            {!compact && <>
                                <th scope="col" aria-label="Won" className="w-10">W</th>
                                <th scope="col" aria-label="Drawn" className="w-10">D</th>
                                <th scope="col" aria-label="Lost" className="w-10">L</th>
                                <th scope="col" aria-label="Goal difference" className="w-12">GD</th>
                            </>}
                            <th scope="col" aria-label="Points" className="w-12">Pts</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {visible.map((row) => (
                            <tr key={row.team.id} className={`${row.position === 1 ? 'bg-accent/10' : ''} transition-colors duration-150 hover:bg-surface-2 motion-reduce:transition-none`}>
                                <td className="py-3 text-center font-display font-bold text-text-2">{row.position}</td>
                                <th scope="row" className="py-3 pr-2 text-left font-medium">
                                    <span className="flex items-center gap-2"><StandingCrest team={row.team} /><span className="min-w-0 break-words">{row.team.name}</span></span>
                                </th>
                                <td className="text-center text-text-2">{row.played}</td>
                                {!compact && <>
                                    <td className="text-center text-text-2">{row.won}</td>
                                    <td className="text-center text-text-2">{row.drawn}</td>
                                    <td className="text-center text-text-2">{row.lost}</td>
                                    <td className="text-center text-text-2">{row.goalDifference > 0 ? '+' : ''}{row.goalDifference}</td>
                                </>}
                                <td className="text-center font-display font-bold text-accent-text">{row.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {!compact && <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-text-2">P Played · W Won · D Drawn · L Lost · GD Goal difference · PTS Points</p>}
        </div>
    )
}

export default StandingsTable
