import { useEffect, useRef } from 'react'
import { DOMESTIC_LEAGUES, LEAGUES } from '../../types/league'
import HorizontalScroller from '../ui/HorizontalScroller'
import LeagueEmblem from '../ui/LeagueEmblem'
import { STANDINGS_CODES } from '../../services/scheduleApi'
import { useLocale } from '../../i18n/LocaleProvider'

function LeagueTabs({
    activeId,
    onChange,
    showAll = true,
    emblems,
}: {
    activeId: string
    onChange: (id: string) => void
    showAll?: boolean
    emblems?: Record<string, string | undefined>
}) {
    const { t, competitionName } = useLocale()
    const competitionTabs = showAll ? LEAGUES : DOMESTIC_LEAGUES
    const tabs = showAll ? [{ id: 'all', name: t('common.allCompetitions'), shortName: t('common.all') }, ...competitionTabs] : competitionTabs
    const activeTab = useRef<HTMLButtonElement>(null)

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
        <HorizontalScroller role="group" ariaLabel={t('common.allCompetitions')} className="flex gap-2 px-4 py-3">
            {tabs.map((tab) => {
                const isActive = tab.id === activeId
                const label = tab.id === 'all' ? tab.name : competitionName(tab.name)
                return (
                    <button
                        key={tab.id}
                        ref={isActive ? activeTab : undefined}
                        type="button"
                        aria-pressed={isActive}
                        aria-label={label}
                        title={label}
                        onClick={() => onChange(tab.id)}
                        className={`min-h-11 shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text motion-reduce:transition-none ${isActive ? 'bg-accent/15 text-accent-text hover:bg-accent/25 active:bg-accent/30' : 'bg-surface-2 text-text-2 hover:bg-surface-3 hover:text-text active:bg-accent/15 active:text-accent-text'}`}
                    >
                        <span className="flex items-center gap-2">
                            {tab.id === 'all'
                                ? t('common.all')
                                : <>
                                    <LeagueEmblem code={STANDINGS_CODES[tab.id]} src={emblems?.[tab.id]} label={tab.shortName} />
                                    <span>{label}</span>
                                </>}
                        </span>
                    </button>
                )
            })}
        </HorizontalScroller>
    )
}

export default LeagueTabs