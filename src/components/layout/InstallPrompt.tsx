import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'

/** Chrome fires this event only when install criteria are met (manifest, HTTPS, etc). */
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
}

/**
 * InstallPrompt — shows a dismissible bar offering to install BIG5 as a PWA.
 * Only fires on Chrome/Android (iOS Safari doesn't support this API — that's
 * a platform limitation, not a bug). Stays hidden until the browser signals
 * the app is actually installable.
 */
function InstallPrompt() {
    const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        function handler(e: Event) {
            e.preventDefault()
            setDeferredEvent(e as BeforeInstallPromptEvent)
        }
        window.addEventListener('beforeinstallprompt', handler)
        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    if (!deferredEvent || dismissed) return null

    async function handleInstall() {
        await deferredEvent?.prompt()
        setDeferredEvent(null)
    }

    return (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2 px-4 py-2.5">
            <span className="text-sm font-medium text-text">Install BIG5 for quick access</span>
            <div className="flex shrink-0 items-center gap-2">
                <button
                    onClick={handleInstall}
                    className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white"
                >
                    <Download size={14} /> Install
                </button>
                <button onClick={() => setDismissed(true)} aria-label="Dismiss" className="p-1 text-text-3">
                    <X size={16} />
                </button>
            </div>
        </div>
    )
}

export default InstallPrompt