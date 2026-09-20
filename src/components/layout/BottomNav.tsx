import { NavLink } from 'react-router-dom'
import { Calendar, CalendarDays, Radio, Trophy, Star } from 'lucide-react'

const NAV_ITEMS = [
    { to: '/', label: 'Today', icon: Calendar, end: true },
    { to: '/week', label: 'Week', icon: CalendarDays },
    { to: '/live', label: 'Live', icon: Radio },
    { to: '/standings', label: 'Standings', icon: Trophy },
    { to: '/favorites', label: 'Favorites', icon: Star },
]

function BottomNav() {
    return (
        <nav
            aria-label="Mobile primary navigation"
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden
         border-t border-border bg-surface-1/95 backdrop-blur
         pb-[env(safe-area-inset-bottom)]"
        >
            <ul className="flex h-16 items-stretch justify-around">
                {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                    <li key={to} className="flex-1">
                        <NavLink
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex h-full flex-col items-center justify-center gap-1
                 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent-text
                 ${isActive ? 'text-accent' : 'text-text-3'}`
                            }
                        >
                            <Icon aria-hidden="true" size={22} strokeWidth={2.2} />
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default BottomNav
