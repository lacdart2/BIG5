import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import LeagueEmblem from '../ui/LeagueEmblem'
import { LEAGUES } from '../../types/league'
import type { Match } from '../../types/football'

/** Summarizes the same seven-day fixture response used by the date controls. */
function WeekPreview({ matches, loading, error, emblems }: {
    matches: Match[]
    loading: boolean
    error: string | null
    emblems: Record<string, string | undefined>
}) {
    return (
        <section aria-labelledby="week-preview-title">
            <div className="mb-2 flex items-center justify-between gap-3">
                <h2 id="week-preview-title" className="font-display text-lg font-bold tracking-tight">Across the week</h2>
                <Link to="/week" className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-accent-text hover:text-text focus-visible:outline-2 focus-visible:outline-accent-text">Full schedule <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </div>
            <div aria-busy={loading} className="overflow-hidden rounded-2xl border border-border bg-surface-1">
                <p className="border-b border-border px-4 py-3 text-xs text-text-2">Next seven days · All five leagues</p>
                {loading ? <p className="p-4 text-sm text-text-2">Loading the week ahead…</p> : error ? <p className="p-4 text-sm text-text-2">Week preview is unavailable until fixtures load.</p> : (
                    <ul className="divide-y divide-border">
                        {LEAGUES.map((league) => {
                            const count = matches.filter((match) => match.leagueApiId === league.apiId).length
                            return (
                                <li key={league.id} className="flex items-center gap-3 px-4 py-3">
                                    <LeagueEmblem src={emblems[league.id]} label={league.shortName} />
                                    <span className="flex-1 text-sm font-medium">{league.name}</span>
                                    <span className="text-xs tabular-nums text-text-2">{count} {count === 1 ? 'match' : 'matches'}</span>
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
