import { Link, NavLink } from 'react-router-dom'
import { Languages } from 'lucide-react'
import ShareButton from '../ui/ShareButton'
import { useLocale } from '../../i18n/LocaleProvider'

const NAV_LINKS = [
    { to: '/', key: 'nav.today', end: true },
    { to: '/week', key: 'nav.week', end: false },
    { to: '/live', key: 'nav.live', end: false },
    { to: '/standings', key: 'nav.standings', end: false },
    { to: '/favorites', key: 'nav.favorites', end: false },
] as const

function Header() {
    const { locale, toggleLocale, t } = useLocale()

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-surface-1/95 backdrop-blur pt-[env(safe-area-inset-top)]">
            <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4 lg:h-16 lg:max-w-[1220px] lg:px-6 xl:px-8">
                <Link
                    to="/"
                    aria-label="BIG5 Football home"
                    className="flex items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-text"
                    dir="ltr"
                >
                    <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="34" stroke="#6366F1" strokeWidth="5" />
                        <polygon points="50,29 68.6,42.6 61.5,64.2 38.5,64.2 31.4,42.6" fill="#6366F1" />
                        <line x1="50" y1="29" x2="50" y2="16" stroke="#6366F1" strokeWidth="5" />
                        <line x1="68.6" y1="42.6" x2="79.4" y2="35.3" stroke="#6366F1" strokeWidth="5" />
                        <line x1="61.5" y1="64.2" x2="65.5" y2="76.4" stroke="#6366F1" strokeWidth="5" />
                        <line x1="38.5" y1="64.2" x2="34.5" y2="76.4" stroke="#6366F1" strokeWidth="5" />
                        <line x1="31.4" y1="42.6" x2="20.6" y2="35.3" stroke="#6366F1" strokeWidth="5" />
                    </svg>
                    <span className="font-display text-xl font-extrabold tracking-tight text-accent">BIG5</span>
                </Link>

                <nav aria-label="Primary navigation" className="hidden self-stretch lg:flex lg:items-stretch lg:gap-1">
                    {NAV_LINKS.map(({ to, key, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center border-b-2 px-3 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text ${isActive ? 'border-accent text-accent-text' : 'border-transparent text-text-2 hover:border-border hover:text-text'}`
                            }
                        >
                            {t(key)}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleLocale}
                        aria-label={locale === 'en' ? t('language.switchToArabic') : t('language.switchToEnglish')}
                        className="flex min-h-9 items-center gap-1.5 rounded-full bg-surface-3 px-3 text-xs font-bold text-text transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
                    >
                        <Languages size={16} aria-hidden="true" />
                        <span dir="ltr">{locale === 'en' ? 'AR' : 'EN'}</span>
                    </button>
                    <ShareButton />
                </div>
            </div>
        </header>
    )
}

export default Header