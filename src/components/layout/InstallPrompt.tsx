import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
}

function InstallPrompt() {
    const [deferredEvent, setDeferredEvent] =
        useState<BeforeInstallPromptEvent | null>(null)

    const [dismissed, setDismissed] = useState(false)
    const [installed, setInstalled] = useState(false)

    useEffect(() => {
        const alreadyInstalled =
            window.matchMedia('(display-mode: standalone)').matches

        if (alreadyInstalled) {
            setInstalled(true)
            return
        }

        function handleBeforeInstallPrompt(event: Event) {
            event.preventDefault()

            setDeferredEvent(
                event as BeforeInstallPromptEvent
            )
        }

        function handleInstalled() {
            setInstalled(true)
            setDeferredEvent(null)
        }

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt
        )

        window.addEventListener(
            'appinstalled',
            handleInstalled
        )

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt
            )

            window.removeEventListener(
                'appinstalled',
                handleInstalled
            )
        }
    }, [])

    if (!deferredEvent || dismissed || installed) {
        return null
    }

    async function handleInstall() {
        if (!deferredEvent) return

        await deferredEvent.prompt()

        const choice = await deferredEvent.userChoice

        if (choice.outcome === 'accepted') {
            setDeferredEvent(null)
        }
    }

    return (
        <div
            className="
                fixed
                inset-x-3
                z-40
                mx-auto
                flex
                max-w-md
                items-center
                justify-between
                gap-3
                rounded-2xl
                bg-accent
                px-4
                py-3
                lg:inset-x-auto
                lg:right-6
            "
            style={{
                bottom:
                    'calc(4.5rem + env(safe-area-inset-bottom))',
            }}
        >
            <div className="flex items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Download
                        size={18}
                        className="text-white"
                    />
                </span>

                <div>
                    <p className="text-sm font-bold text-white">
                        Install BIG5
                    </p>

                    <p className="text-xs text-white/80">
                        Quick access from your home screen
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
                <button
                    type="button"
                    onClick={handleInstall}
                    className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-accent"
                >
                    Install
                </button>

                <button
                    type="button"
                    onClick={() => setDismissed(true)}
                    aria-label="Dismiss"
                    className="p-1.5 text-white/70"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    )
}

export default InstallPrompt