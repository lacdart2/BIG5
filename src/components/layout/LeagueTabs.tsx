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
}: {
    activeId: string
    onChange: (id: string) => void
}) {
    const tabs = [{ id: 'all', shortName: 'All' }, ...LEAGUES]

    return (
        <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
            {tabs.map((tab) => {
                const isActive = tab.id === activeId
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors
              ${isActive ? 'bg-accent/15 text-accent-text' : 'bg-surface-2 text-text-2'}`}
                    >
                        {tab.shortName}
                    </button>
                )
            })}
        </div>
    )
}

export default LeagueTabs