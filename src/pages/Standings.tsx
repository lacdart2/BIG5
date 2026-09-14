import { useEffect, useRef, useState } from 'react'
import { Trophy } from 'lucide-react'
import LeagueTabs from '../components/layout/LeagueTabs'
import TeamCrest from '../components/ui/TeamCrest'
import type { Team } from '../types/football'
import { LEAGUES } from '../types/league'
import type { League } from '../types/league'
import { fetchStandings, STANDINGS_CODES } from '../services/scheduleApi'
import type { Standing } from '../services/scheduleApi'

/** Each league loads independently so one failure does not hide other tables. */
interface LeagueStandingsState {
    standings: Standing[]
    isLoading: boolean
    error: string | null
}

/** Reuses the shared crest with its monogram fallback if a remote image fails. */
function StandingCrest({ team }: { team: Team }) {
    const [hasImageError, setHasImageError] = useState(false)

    return (
        <span aria-hidden="true" className="shrink-0" onErrorCapture={() => setHasImageError(true)}>
            <TeamCrest team={hasImageError ? { ...team, crestUrl: undefined } : team} />
        </span>
    )
}

/**
 * LeagueStandings — the selected league's loading, error, or standings view.
 */
function LeagueStandings({ league, state }: { league: League; state: LeagueStandingsState }) {
    const { standings, isLoading, error } = state

    return (
        <section aria-labelledby={`${league.id}-heading`} className="overflow-hidden rounded-2xl border border-border bg-surface-1">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-text">
                        <Trophy size={20} aria-hidden="true" />
                    </span>
                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-2">{league.country}</p>
                        <h2 id={`${league.id}-heading`} className="font-display text-lg font-bold text-text">{league.name}</h2>
                    </div>
                </div>
            </div>

            {isLoading && (
                <p role="status" className="py-8 text-center text-sm text-text-3">Loading standings…</p>
            )}

            {!isLoading && error && (
                <p role="alert" className="py-8 text-center text-sm text-live">{error}</p>
            )}

            {!isLoading && !error && standings.length === 0 && (
                <p className="py-8 text-center text-sm text-text-3">No standings available for this league.</p>
            )}

            {!isLoading && !error && standings.length > 0 && (
                <>
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-text-2">
                        <span className="font-semibold uppercase tracking-wide">League table · {standings.length} teams</span>
                        <span id={`${league.id}-scroll-hint`} className="sm:hidden">Scroll for all stats →</span>
                    </div>

                    {/* Keyboard-accessible scrolling keeps all eight columns readable on small screens. */}
                    <div
                        role="region"
                        aria-label={`${league.name} standings table`}
                        aria-describedby={`${league.id}-scroll-hint`}
                        tabIndex={0}
                        className="overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-text"
                    >
                        <table className="w-full min-w-[480px] border-collapse text-sm">
                            <caption className="sr-only">
                                {league.name} standings, ordered by official league position.
                            </caption>
                            <thead className="border-y border-border bg-surface-2 text-xs text-text-2">
                                <tr>
                                    <th scope="col" aria-label="Position" className="w-10 py-3 pl-3 pr-2 text-center font-semibold">#</th>
                                    <th scope="col" className="py-3 pr-3 text-left font-semibold">Team</th>
                                    <th scope="col" aria-label="Played" className="px-2 py-3 text-center font-semibold">P</th>
                                    <th scope="col" aria-label="Won" className="px-2 py-3 text-center font-semibold">W</th>
                                    <th scope="col" aria-label="Drawn" className="px-2 py-3 text-center font-semibold">D</th>
                                    <th scope="col" aria-label="Lost" className="px-2 py-3 text-center font-semibold">L</th>
                                    <th scope="col" aria-label="Goal difference" className="px-2 py-3 text-center font-semibold">GD</th>
                                    <th scope="col" aria-label="Points" className="bg-accent/10 py-3 pl-2 pr-3 text-center font-bold text-accent-text">PTS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {standings.map(({ position, team, played, won, drawn, lost, goalDifference, points }) => (
                                    <tr key={team.id} className={position === 1 ? 'bg-accent/10' : undefined}>
                                        <td className={`py-4 pl-3 pr-2 text-center font-display font-bold tabular-nums ${position === 1 ? 'text-accent-text' : 'text-text-2'}`}>
                                            {position}
                                        </td>
                                        <th scope="row" className="py-4 pr-3 text-left font-semibold text-text">
                                            <div className="flex items-center gap-2.5">
                                                <StandingCrest team={team} />
                                                <div>
                                                    <span className="sr-only">{team.name}</span>
                                                    <span aria-hidden="true" className="whitespace-nowrap">{team.shortName}</span>
                                                    {position === 1 && <span className="mt-0.5 block text-xs font-medium text-accent-text">League leader</span>}
                                                </div>
                                            </div>
                                        </th>
                                        <td className="px-2 py-4 text-center font-display tabular-nums text-text-2">{played}</td>
                                        <td className="px-2 py-4 text-center font-display tabular-nums text-text-2">{won}</td>
                                        <td className="px-2 py-4 text-center font-display tabular-nums text-text-2">{drawn}</td>
                                        <td className="px-2 py-4 text-center font-display tabular-nums text-text-2">{lost}</td>
                                        <td className="px-2 py-4 text-center font-display font-semibold tabular-nums text-text">
                                            {goalDifference > 0 ? `+${goalDifference}` : goalDifference}
                                        </td>
                                        <td className="bg-accent/10 py-4 pl-2 pr-3 text-center font-display text-xl font-extrabold tabular-nums text-text">
                                            {points}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-2 border-t border-border px-4 py-3 text-xs leading-relaxed text-text-2">
                        <p>P Played · W Won · D Drawn · L Lost · GD Goal difference · PTS Points</p>
                    </div>
                </>
            )}
        </section>
    )
}

/** Standings — fetches all five leagues once on mount; filters reuse those results. */
function Standings() {
    const [activeLeagueId, setActiveLeagueId] = useState('pl')
    const [leagueStates, setLeagueStates] = useState<Record<string, LeagueStandingsState>>(() =>
        Object.fromEntries(LEAGUES.map((league) => [league.id, {
            standings: [],
            isLoading: true,
            error: null,
        }]))
    )
    const requests = useRef(new Map<string, Promise<Standing[]>>())

    useEffect(() => {
        let isActive = true

        LEAGUES.forEach((league) => {
            // Reuse the request when Strict Mode replays this effect in development.
            let request = requests.current.get(league.id)
            if (!request) {
                request = fetchStandings(STANDINGS_CODES[league.id])
                requests.current.set(league.id, request)
            }

            request
                .then((standings) => {
                    if (!isActive) return
                    setLeagueStates((previous) => ({
                        ...previous,
                        [league.id]: { standings, isLoading: false, error: null },
                    }))
                })
                .catch(() => {
                    if (!isActive) return
                    setLeagueStates((previous) => ({
                        ...previous,
                        [league.id]: {
                            standings: [],
                            isLoading: false,
                            error: 'Could not load standings. Please try again.',
                        },
                    }))
                })
        })

        return () => { isActive = false }
    }, [])

    const visibleLeagues = LEAGUES.filter((league) => league.id === activeLeagueId)

    return (
        <div className="space-y-6 bg-bg p-4">
            <header className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent-text">
                    The season in numbers
                </p>
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-text">
                    Standings<span className="text-accent">.</span>
                </h1>
                <p className="text-sm text-text-2">Every point counts. Follow the race to the top.</p>
            </header>

            <div className="-mx-4">
                <LeagueTabs activeId={activeLeagueId} onChange={setActiveLeagueId} showAll={false} />
            </div>

            {visibleLeagues.map((league) => (
                <LeagueStandings key={league.id} league={league} state={leagueStates[league.id]} />
            ))}
        </div>
    )
}

export default Standings
