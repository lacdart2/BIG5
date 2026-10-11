import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type ThemeMode = 'auto' | 'light' | 'dark'
type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'big5-theme-mode'
const DAY_START_HOUR = 7
const NIGHT_START_HOUR = 19

interface ThemeContextValue {
    mode: ThemeMode
    resolvedTheme: ResolvedTheme
    setMode: (mode: ThemeMode) => void
    cycleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readInitialMode(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' || stored === 'auto' ? stored : 'auto'
}

function resolveAutoTheme(date = new Date()): ResolvedTheme {
    const hour = date.getHours()
    return hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>(readInitialMode)
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
        mode === 'auto' ? resolveAutoTheme() : mode
    )

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, mode)

        const applyTheme = () => {
            const next = mode === 'auto' ? resolveAutoTheme() : mode
            setResolvedTheme(next)
            document.documentElement.dataset.theme = next
            document.documentElement.style.colorScheme = next

            const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
            if (themeMeta) {
                themeMeta.content = next === 'light' ? '#f5f7fb' : '#000000'
            }
        }

        applyTheme()

        if (mode !== 'auto') return

        const interval = window.setInterval(applyTheme, 5 * 60 * 1000)
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') applyTheme()
        }
        document.addEventListener('visibilitychange', handleVisibility)

        return () => {
            window.clearInterval(interval)
            document.removeEventListener('visibilitychange', handleVisibility)
        }
    }, [mode])

    const value = useMemo<ThemeContextValue>(() => ({
        mode,
        resolvedTheme,
        setMode: setModeState,
        cycleMode: () => {
            setModeState((current) => current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto')
        },
    }), [mode, resolvedTheme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used inside ThemeProvider')
    return context
}
