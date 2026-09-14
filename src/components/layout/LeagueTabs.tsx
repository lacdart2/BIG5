import { useState } from 'react'
import { LEAGUES } from '../../types/league'

/**
 * LeagueTabs — horizontal scroll pills to filter by league (design brief
 * section 6). Currently local UI state only (useState) — not yet wired to
 * actually filter matches, since real data + real league IDs arrive in
 * MVP 0.2. This is the scaffold; filtering logic hooks in later.
 */
function LeagueTabs() {
    const [activeId, setActiveId] = useState<string>('all')

    const tabs = [{ id: 'all', shortName: 'All' }, ...LEAGUES]

    return (
        <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
            {tabs.map((tab) => {
                const isActive = tab.id === activeId
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveId(tab.id)}
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