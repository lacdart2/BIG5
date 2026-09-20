import type { Match } from '../../types/football'

/** Counts reflect the selected date and league, without additional requests. */
function StatsStrip({ matches, date, pending }: { matches: Match[]; date: string; pending: boolean }) {
    const counts = [
        { label: 'Matches', value: matches.length },
        { label: 'Live', value: matches.filter((match) => match.status === 'live').length },
        { label: 'Upcoming', value: matches.filter((match) => match.status === 'upcoming').length },
    ]

    return (
        <section aria-label="Matchday summary" className="rounded-2xl border border-border bg-surface-1">
            <p className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 text-xs font-medium text-text-2">
                <time dateTime={date}>{new Date(`${date}T12:00:00`).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</time>
                <span className="text-accent-text">Matchday brief</span>
            </p>
            <dl className="grid grid-cols-3 divide-x divide-border py-4">
                {counts.map(({ label, value }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                        <dt className="order-2 text-[11px] font-semibold uppercase tracking-wider text-text-2">{label}</dt>
                        <dd className={`font-display text-3xl font-extrabold tabular-nums ${label === 'Live' && value > 0 ? 'text-live' : 'text-text'}`}>{pending ? '—' : value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    )
}

export default StatsStrip
