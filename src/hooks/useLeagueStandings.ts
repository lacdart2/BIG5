import { useEffect, useState } from 'react'
import { fetchStandings, scheduleErrorMessage, STANDINGS_CODES, type Standing } from '../services/scheduleApi'

interface TableState {
    rows: Standing[]
    error: string | null
}

/** Lazy selection-driven standings shared by the preview and the full page. */
export function useLeagueStandings(leagueId: string) {
    const [tables, setTables] = useState<Record<string, TableState>>({})
    const [attempt, setAttempt] = useState(0)
    const table = tables[leagueId]

    useEffect(() => {
        let active = true
        fetchStandings(STANDINGS_CODES[leagueId]).then(
            (rows) => { if (active) setTables((previous) => ({ ...previous, [leagueId]: { rows, error: null } })) },
            (error) => {
                if (active) setTables((previous) => ({
                    ...previous,
                    [leagueId]: { rows: [], error: scheduleErrorMessage(error, 'Could not load standings. Please try again.') },
                }))
            },
        )
        return () => { active = false }
    }, [leagueId, attempt])

    function retry() {
        setTables((previous) => {
            const next = { ...previous }
            delete next[leagueId]
            return next
        })
        setAttempt((previous) => previous + 1)
    }

    return { rows: table?.rows ?? [], error: table?.error ?? null, isLoading: !table, retry }
}
