/**
 * Header — persistent top app bar with the BIG5 wordmark.
 * Sticky + safe-area aware for PWA/notch devices (added in MVP 0.5,
 * but harmless to include now).
 */
function Header() {
    return (
        <header
            className="sticky top-0 z-40 border-b border-border bg-surface-1/95 backdrop-blur
                 pt-[env(safe-area-inset-top)]"
        >
            <div className="mx-auto flex h-14 max-w-xl items-center px-4">
                <span className="font-display text-xl font-extrabold tracking-tight text-accent">
                    BIG5
                </span>
            </div>
        </header>
    )
}

export default Header