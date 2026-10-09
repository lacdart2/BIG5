import { NavLink } from 'react-router-dom'
import { Calendar, CalendarDays, Radio, Trophy, Star } from 'lucide-react'
import { useLocale } from '../../i18n/LocaleProvider'

const NAV_ITEMS = [
    { to: '/', key: 'nav.today', icon: Calendar, end: true },
    { to: '/week', key: 'nav.week', icon: CalendarDays },
    { to: '/live', key: 'nav.live', icon: Radio },
    { to: '/standings', key: 'nav.standings', icon: Trophy },
    { to: '/favorites', key: 'nav.favorites', icon: Star },
] as const

function BottomNav() {
    const { t } = useLocale()

    return (
        <nav
            aria-label="Mobile primary navigation"
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface-1/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        >
            <ul className="flex h-16 items-stretch justify-around">
                {NAV_ITEMS.map(({ to, key, icon: Icon, end }) => (
                    <li key={to} className="flex-1">
                        <NavLink
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent-text ${isActive ? 'text-accent' : 'text-text-3'}`
                            }
                        >
                            <Icon aria-hidden="true" size={22} strokeWidth={2.2} />
                            {t(key)}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default BottomNav