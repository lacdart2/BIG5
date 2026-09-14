import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * HorizontalScroller — wraps a horizontally-scrolling row (league pills,
 * day tabs) and shows a soft edge fade whenever content is cut off
 * off-screen — important at higher zoom levels where not everything
 * fits. Each fade disappears once you've scrolled to that edge, so it
 * never lingers when there's nothing left to reveal.
 */
function HorizontalScroller({
    children,
    className = '',
    role,
    ariaLabel,
}: {
    children: ReactNode
    className?: string
    role?: string
    ariaLabel?: string
}) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [showLeftFade, setShowLeftFade] = useState(false)
    const [showRightFade, setShowRightFade] = useState(false)

    function updateFades() {
        const el = scrollRef.current
        if (!el) return
        setShowLeftFade(el.scrollLeft > 4)
        setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }

    useEffect(() => {
        updateFades()
        window.addEventListener('resize', updateFades)
        return () => window.removeEventListener('resize', updateFades)
    }, [])

    return (
        <div className="relative">
            <div
                ref={scrollRef}
                onScroll={updateFades}
                role={role}
                aria-label={ariaLabel}
                className={`overflow-x-auto [scrollbar-width:none] ${className}`}
            >
                {children}
            </div>
            {showLeftFade && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-bg to-transparent"
                />
            )}
            {showRightFade && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg to-transparent"
                />
            )}
        </div>
    )
}

export default HorizontalScroller