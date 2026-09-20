import { useState } from 'react'

/** Shares the app's URL via the Web Share API, falling back to clipboard-copy. */
function ShareButton() {
    const [copied, setCopied] = useState(false)

    async function handleShare() {
        const shareData = {
            title: 'BIG5 Football',
            text: "Follow Europe's top five leagues — live scores, fixtures and standings.",
            url: window.location.href,
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch {
                // User cancelled the share sheet.
            }
            return
        }

        try {
            await navigator.clipboard.writeText(shareData.url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard access can be blocked by the browser.
        }
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={handleShare}
                aria-label="Share BIG5 Football"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-surface-3 text-text transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
            >
                {copied ? (
                    <span className="text-[11px] font-semibold" aria-hidden="true">Copied</span>
                ) : (
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.6" y1="10.6" x2="15.4" y2="6.4" />
                        <line x1="8.6" y1="13.4" x2="15.4" y2="17.6" />
                    </svg>
                )}
            </button>
            <span className="sr-only" role="status" aria-live="polite">
                {copied ? 'BIG5 link copied to clipboard' : ''}
            </span>
        </div>
    )
}

export default ShareButton
