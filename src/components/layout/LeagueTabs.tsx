import { LEAGUES } from '../../types/league'

/**
 * LeagueTabs — horizontal scroll pills to filter by league.
 * Now a "controlled component": the parent page owns which tab is
 * active (activeId) and how it changes (onChange), so the parent
 * can use that same selection to filter its match list.
 */
function LeagueTabs({
    activeId,
    onChange,
    showAll = true,
}: {
    activeId: string
    onChange: (id: string) => void
    /** Hide the combined view on pages that display one league at a time. */
    showAll?: boolean
}) {
    const tabs = showAll ? [{ id: 'all', shortName: 'All' }, ...LEAGUES] : LEAGUES

    return (
        <div role="group" aria-label="Filter by league" className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
            {tabs.map((tab) => {
                const isActive = tab.id === activeId
                return (
                    <button
                        key={tab.id}
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
        </div>
    )
}

export default LeagueTabs
