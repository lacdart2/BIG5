import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

interface DateNavProps {
    dates: string[]
    activeIndex: number
    onChange: (index: number) => void
}

/** Today's date-navigation presentation, bounded by the already-fetched range. */
function DateNav({ dates, activeIndex, onChange }: DateNavProps) {
    const selectedDate = dates[activeIndex]
    if (!selectedDate) return null

    const label = `${activeIndex === 0 ? 'Today · ' : ''}${new Date(`${selectedDate}T12:00:00`).toLocaleDateString([], { month: 'short', day: 'numeric' })}`
    const arrowClass = 'flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-1 text-text-2 transition-colors hover:bg-surface-3 hover:text-text active:bg-accent/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text disabled:cursor-default disabled:opacity-30 motion-reduce:transition-none'

    return (
        <div role="group" aria-label="Fixture date" className="flex items-center justify-between gap-3 px-4 pb-3">
            <button
                type="button"
                aria-label="Previous day"
                disabled={activeIndex === 0}
                onClick={() => onChange(Math.max(0, activeIndex - 1))}
                className={arrowClass}
            >
                <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays size={16} className="text-accent-text" aria-hidden="true" />
                <time dateTime={selectedDate}>{label}</time>
            </div>
            <button
                type="button"
                aria-label="Next day"
                disabled={activeIndex === dates.length - 1}
                onClick={() => onChange(Math.min(dates.length - 1, activeIndex + 1))}
                className={arrowClass}
            >
                <ChevronRight size={18} aria-hidden="true" />
            </button>
        </div>
    )
}

export default DateNav
