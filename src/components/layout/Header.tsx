/**
 * Header — persistent top app bar with the BIG5 wordmark + football mark.
 * The ball icon (circle + pentagon + seams) matches the app icon/favicon
 * for one consistent brand identity across the icon and in-app header.
 */
import ShareButton from '../ui/ShareButton'
function Header() {
    return (
        <header
            className="sticky top-0 z-40 border-b border-border bg-surface-1/95 backdrop-blur
                 pt-[env(safe-area-inset-top)]"
        >
            <div className="mx-auto flex h-14 max-w-xl items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="34" stroke="#6366F1" strokeWidth="5" />
                        <polygon points="50,29 68.6,42.6 61.5,64.2 38.5,64.2 31.4,42.6" fill="#6366F1" />
                        <line x1="50" y1="29" x2="50" y2="16" stroke="#6366F1" strokeWidth="5" />
                        <line x1="68.6" y1="42.6" x2="79.4" y2="35.3" stroke="#6366F1" strokeWidth="5" />
                        <line x1="61.5" y1="64.2" x2="65.5" y2="76.4" stroke="#6366F1" strokeWidth="5" />
                        <line x1="38.5" y1="64.2" x2="34.5" y2="76.4" stroke="#6366F1" strokeWidth="5" />
                        <line x1="31.4" y1="42.6" x2="20.6" y2="35.3" stroke="#6366F1" strokeWidth="5" />
                    </svg>
                    <span className="font-display text-xl font-extrabold tracking-tight text-accent">
                        BIG5
                    </span>
                </div>
                <ShareButton />
            </div>
        </header>
    )
}

export default Header