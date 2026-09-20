import ScheduleLoading from './ScheduleLoading'
import StandingsTable from './StandingsTable'
import type { Standing } from '../../services/scheduleApi'

interface StandingsContentProps {
    leagueName: string
    rows: Standing[]
    isLoading: boolean
    error: string | null
    retry: () => void
    compact?: boolean
}

/** Shared loading, retry, empty, and populated states for standings panels. */
function StandingsContent({ leagueName, rows, isLoading, error, retry, compact }: StandingsContentProps) {
    return (
        <div aria-busy={isLoading} className="min-h-64 border-t border-border">
            {isLoading ? <div className="p-6"><ScheduleLoading>Loading {leagueName} standings…</ScheduleLoading></div> : error ? (
                <div className="p-6">
                    <p role="status" className="text-sm text-text-2">{error}</p>
                    <button type="button" onClick={retry} className="mt-3 min-h-11 cursor-pointer rounded-full bg-accent/15 px-4 text-sm font-semibold text-accent-text hover:bg-accent/25 focus-visible:outline-2 focus-visible:outline-accent-text">Retry standings</button>
                </div>
            ) : rows.length === 0 ? <p className="p-6 text-sm text-text-2">No standings available for {leagueName}.</p> : <StandingsTable rows={rows} leagueName={leagueName} compact={compact} />}
        </div>
    )
}

export default StandingsContent
