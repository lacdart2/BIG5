import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'

/** Chrome fires this event only when install criteria are met (manifest, HTTPS, etc). */
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
}

/**
 * InstallPrompt — floats just above the bottom nav as a bold solid-indigo
 * card, impossible to miss on scan. No drop shadow (per design system:
 * shadows look fake on true black) — prominence comes from color fill
 * alone, the only saturated element on an otherwise monochrome screen.
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
        <div
            className="fixed inset-x-3 z-40 flex items-center justify-between gap-3 rounded-2xl bg-accent px-4 py-3"
            style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
        >
            <div className="flex items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Download size={18} className="text-white" />
                </span>
                <div>
                    <p className="text-sm font-bold text-white">Install BIG5</p>
                    <p className="text-xs text-white/80">Quick access from your home screen</p>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
                <button
                    onClick={handleInstall}
                    className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-accent"
                >
                    Install
                </button>
                <button onClick={() => setDismissed(true)} aria-label="Dismiss" className="p-1.5 text-white/70">
                    <X size={16} />
                </button>
            </div>
        </div>
    )
}

export default InstallPrompt