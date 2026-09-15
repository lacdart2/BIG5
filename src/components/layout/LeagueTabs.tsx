import { useEffect, useRef } from 'react'
import { LEAGUES } from '../../types/league'
import HorizontalScroller from '../ui/HorizontalScroller'

/**
 * LeagueTabs — horizontal scroll pills to filter by league.
 * Wrapped in HorizontalScroller so users get a fade hint when
 * tabs are cut off (e.g. Ligue 1 hidden at higher zoom levels).
 */
function LeagueTabs({
    activeId,
    onChange,
    showAll = true,
}: {
    activeId: string
    onChange: (id: string) => void
    showAll?: boolean
}) {
    const tabs = showAll ? [{ id: 'all', shortName: 'All' }, ...LEAGUES] : LEAGUES
    const activeTab = useRef<HTMLButtonElement>(null)

    /** Keep a selection made by swiping visible without moving the page vertically. */
    useEffect(() => {
        const button = activeTab.current
        const scroller = button?.closest<HTMLElement>('[role="group"]')
        if (!button || !scroller) return
        const buttonRect = button.getBoundingClientRect()
        const scrollerRect = scroller.getBoundingClientRect()
        if (buttonRect.left < scrollerRect.left + 16 || buttonRect.right > scrollerRect.right - 16) {
            scroller.scrollBy({
                left: buttonRect.left - scrollerRect.left - (scrollerRect.width - buttonRect.width) / 2,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
            })
        }
    }, [activeId])

    return (
        <HorizontalScroller role="group" ariaLabel="Filter by league" className="flex gap-2 px-4 py-3">
            {tabs.map((tab) => {
                const isActive = tab.id === activeId
                return (
                    <button
                        key={tab.id}
                        ref={isActive ? activeTab : undefined}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => onChange(tab.id)}
                        className={`min-h-11 shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text motion-reduce:transition-none
              ${isActive ? 'bg-accent/15 text-accent-text hover:bg-accent/25 active:bg-accent/30' : 'bg-surface-2 text-text-2 hover:bg-surface-3 hover:text-text active:bg-accent/15 active:text-accent-text'}`}
                    >
                        {tab.shortName}
                    </button>
                )
            })}
        </HorizontalScroller>
    )
}

export default LeagueTabs
