import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Shield, Star, Trophy, UserRound, Users } from 'lucide-react'
import TeamCrest from '../components/ui/TeamCrest'
import LeagueEmblem from '../components/ui/LeagueEmblem'
import ScheduleLoading from '../components/ui/ScheduleLoading'
import {
    fetchStandings,
    fetchTeamMatches,
    fetchTeamProfile,
    scheduleErrorMessage,
    STANDINGS_CODES,
} from '../services/scheduleApi'
import type { Standing, TeamProfile } from '../services/scheduleApi'
import type { Match } from '../types/football'
import { DOMESTIC_LEAGUES } from '../types/league'
import { useFavoriteTeams } from '../hooks/useFavoriteTeams'
import { useLocale } from '../i18n/LocaleProvider'

function resultForTeam(match: Match, teamId: string): 'W' | 'D' | 'L' | null {
    if (match.status !== 'finished' || match.homeScore == null || match.awayScore == null) return null

    const isHome = match.homeTeam.id === teamId
    const teamScore = isHome ? match.homeScore : match.awayScore
    const opponentScore = isHome ? match.awayScore : match.homeScore

    if (teamScore === opponentScore) return 'D'
    return teamScore > opponentScore ? 'W' : 'L'
}

function TeamMatchCard({ match, teamId }: { match: Match; teamId: string }) {
    const { competitionName, dateLocale } = useLocale()
    const kickoff = new Date(match.kickoff)
    const isHome = match.homeTeam.id === teamId
    const opponent = isHome ? match.awayTeam : match.homeTeam
    const score = match.status === 'upcoming'
        ? kickoff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : `${match.homeScore ?? '—'} : ${match.awayScore ?? '—'}`

    return (
        <Link
            to={`/match/${match.id}`}
            className="flex min-h-20 items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-text"
        >
            <div className="w-16 shrink-0 text-xs text-text-2">
                <p>{kickoff.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' })}</p>
                <p className="mt-1 truncate">{competitionName(match.competition)}</p>
            </div>

            <TeamCrest team={opponent} size={30} />

            <div className="min-w-0 flex-1">
                <p dir="ltr" className="truncate text-sm font-semibold">{opponent.shortName}</p>
                <p className="mt-1 text-xs text-text-3">{isHome ? 'HOME' : 'AWAY'}</p>
            </div>

            <div dir="ltr" className="font-display text-sm font-bold tabular-nums">
                {score}
            </div>
        </Link>
    )
}

function TeamDetails() {
    const { teamId } = useParams()
    const [team, setTeam] = useState<TeamProfile | null>(null)
    const [matches, setMatches] = useState<Match[]>([])
    const [standing, setStanding] = useState<Standing | null>(null)
    const [leagueName, setLeagueName] = useState<string | null>(null)
    const [leagueEmblem, setLeagueEmblem] = useState<string | undefined>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const { favorites, isFavorite, toggleFavorite } = useFavoriteTeams()
    const { t, competitionName, dateLocale, isRTL } = useLocale()

    useEffect(() => {
        if (!teamId) return

        const activeTeamId = teamId
        let active = true
        setIsLoading(true)
        setError(null)

        async function load() {
            try {
                const [profile, teamMatches] = await Promise.all([
                    fetchTeamProfile(activeTeamId),
                    fetchTeamMatches(activeTeamId),
                ])

                if (!active) return
                setTeam(profile)
                setMatches(teamMatches)

                const domesticCompetition = profile.runningCompetitions.find((competition) =>
                    DOMESTIC_LEAGUES.some((league) => STANDINGS_CODES[league.id] === competition.code)
                )

                if (domesticCompetition) {
                    setLeagueName(domesticCompetition.name)
                    setLeagueEmblem(domesticCompetition.emblem)
                    const rows = await fetchStandings(domesticCompetition.code)
                    if (!active) return
                    setStanding(rows.find((row) => row.team.id === profile.id) ?? null)
                } else {
                    setStanding(null)
                    setLeagueName(null)
                    setLeagueEmblem(undefined)
                }
            } catch (loadError) {
                if (active) setError(scheduleErrorMessage(loadError, t('team.error')))
            } finally {
                if (active) setIsLoading(false)
            }
        }

        void load()

        return () => {
            active = false
        }
    }, [teamId, t])

    const { recent, upcoming, form } = useMemo(() => {
        const sorted = [...matches].sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())
        const finished = sorted.filter((match) => match.status === 'finished').slice(-5).reverse()
        const next = sorted.filter((match) => match.status !== 'finished').slice(0, 5)
        return {
            recent: finished,
            upcoming: next,
            form: finished
                .slice()
                .reverse()
                .map((match) => resultForTeam(match, teamId ?? ''))
                .filter((value): value is 'W' | 'D' | 'L' => value !== null),
        }
    }, [matches, teamId])

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-[1220px] p-4 lg:p-6">
                <div className="rounded-2xl border border-border bg-surface-1 p-6">
                    <ScheduleLoading>{t('team.loading')}</ScheduleLoading>
                </div>
            </div>
        )
    }

    if (error || !team) {
        return (
            <div className="mx-auto w-full max-w-[1220px] p-4 lg:p-6">
                <Link to="/" className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent-text">
                    <ArrowLeft size={17} className={isRTL ? '-scale-x-100' : ''} />
                    {t('matchDetails.back')}
                </Link>
                <div className="rounded-2xl border border-border bg-surface-1 p-6">
                    <p className="text-sm text-text-2">{error ?? t('team.error')}</p>
                </div>
            </div>
        )
    }

    const favorite = isFavorite(team.id)
    const nextMatch = upcoming[0]
    const nextKickoff = nextMatch ? new Date(nextMatch.kickoff) : null
    const positionLabel = standing ? `#${standing.position}` : '—'

    return (
        <div className="mx-auto w-full max-w-[1220px] space-y-5 p-4 pb-24 lg:p-6 lg:pb-10">
            <div className="flex items-center justify-between gap-3">
                <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-accent-text hover:text-text">
                    <ArrowLeft size={18} className={isRTL ? '-scale-x-100' : ''} />
                    {t('team.back')}
                </Link>

                <button
                    type="button"
                    onClick={() => toggleFavorite(team)}
                    aria-pressed={favorite}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors ${favorite ? 'border-accent/40 bg-accent/15 text-accent-text' : 'border-border bg-surface-1 text-text hover:bg-surface-2'}`}
                >
                    <Star size={17} className={favorite ? 'fill-accent text-accent' : 'text-text-2'} />
                    {favorite ? t('team.following') : t('team.follow')}
                </button>
            </div>

            <section className="today-hero overflow-hidden rounded-3xl border border-accent/25">
                <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center lg:p-8">
                    <div className="flex justify-center md:justify-start">
                        <TeamCrest team={{ id: team.id, name: team.name, shortName: team.shortName, crestUrl: team.crestUrl }} size={88} />
                    </div>

                    <div className="text-center md:text-start">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-text">
                            {team.country ?? t('team.club')}
                        </p>
                        <h1 dir="ltr" className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                            {team.name}
                        </h1>
                        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-text-2 md:justify-start">
                            {team.founded && <span>{t('team.founded')} {team.founded}</span>}
                            {team.venue && <span>{team.venue}</span>}
                        </div>
                    </div>

                    {leagueName && (
                        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface-1/70 px-4 py-3 md:justify-start">
                            <LeagueEmblem src={leagueEmblem} label={leagueName} />
                            <div>
                                <p className="text-[11px] text-text-3">{t('team.league')}</p>
                                <p className="text-sm font-semibold">{competitionName(leagueName)}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 border-t border-border bg-surface-1/75">
                    <div className="p-4 text-center">
                        <p className="font-display text-2xl font-extrabold text-accent-text">{positionLabel}</p>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-text-2">{t('team.position')}</p>
                    </div>

                    <div className="border-x border-border p-4 text-center">
                        <div className="flex min-h-8 items-center justify-center gap-1" dir="ltr">
                            {form.length > 0 ? form.map((value, index) => (
                                <span
                                    key={`${value}-${index}`}
                                    className={`flex size-6 items-center justify-center rounded-full text-[10px] font-extrabold ${value === 'W' ? 'bg-emerald-500/15 text-emerald-400' : value === 'D' ? 'bg-surface-3 text-text-2' : 'bg-live/15 text-live'}`}
                                >
                                    {value}
                                </span>
                            )) : <span className="text-text-3">—</span>}
                        </div>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-text-2">{t('team.form')}</p>
                    </div>

                    <div className="p-4 text-center">
                        <p dir="ltr" className="font-display text-lg font-extrabold">
                            {nextKickoff ? nextKickoff.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' }) : '—'}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-text-2">{t('team.next')}</p>
                    </div>
                </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
                <div className="space-y-5">
                    <section className="overflow-hidden rounded-2xl border border-border bg-surface-1">
                        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                            <div className="flex items-center gap-2">
                                <CalendarDays size={18} className="text-accent-text" />
                                <h2 className="font-display text-lg font-bold">{t('team.nextMatches')}</h2>
                            </div>
                            <span className="text-xs text-text-3">{upcoming.length}</span>
                        </div>

                        {upcoming.length > 0 ? (
                            <div>
                                {upcoming.map((match) => <TeamMatchCard key={match.id} match={match} teamId={team.id} />)}
                            </div>
                        ) : (
                            <p className="p-5 text-sm text-text-2">{t('team.noUpcoming')}</p>
                        )}
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-border bg-surface-1">
                        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                            <div className="flex items-center gap-2">
                                <Shield size={18} className="text-accent-text" />
                                <h2 className="font-display text-lg font-bold">{t('team.recentMatches')}</h2>
                            </div>
                            <span className="text-xs text-text-3">{recent.length}</span>
                        </div>

                        {recent.length > 0 ? (
                            <div>
                                {recent.map((match) => <TeamMatchCard key={match.id} match={match} teamId={team.id} />)}
                            </div>
                        ) : (
                            <p className="p-5 text-sm text-text-2">{t('team.noRecent')}</p>
                        )}
                    </section>
                </div>

                <div className="space-y-5">
                    <section className="rounded-2xl border border-border bg-surface-1 p-5">
                        <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-accent-text" />
                            <h2 className="font-display text-lg font-bold">{t('team.seasonSnapshot')}</h2>
                        </div>

                        <dl className="mt-5 grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-xs text-text-3">{t('team.position')}</dt>
                                <dd className="mt-1 font-display text-2xl font-extrabold">{positionLabel}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-text-3">{t('team.points')}</dt>
                                <dd className="mt-1 font-display text-2xl font-extrabold">{standing?.points ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-text-3">{t('team.played')}</dt>
                                <dd className="mt-1 text-lg font-bold">{standing?.played ?? '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-text-3">{t('team.goalDifference')}</dt>
                                <dd className="mt-1 text-lg font-bold">
                                    {standing ? `${standing.goalDifference > 0 ? '+' : ''}${standing.goalDifference}` : '—'}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section className="rounded-2xl border border-border bg-surface-1 p-5">
                        <div className="flex items-center gap-2">
                            <UserRound size={18} className="text-accent-text" />
                            <h2 className="font-display text-lg font-bold">{t('team.clubInfo')}</h2>
                        </div>

                        <dl className="mt-4 space-y-4">
                            <div>
                                <dt className="text-xs text-text-3">{t('team.coach')}</dt>
                                <dd dir="ltr" className="mt-1 text-sm font-semibold">{team.coach?.name ?? t('team.notAvailable')}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-text-3">{t('team.venue')}</dt>
                                <dd className="mt-1 text-sm font-semibold">{team.venue ?? t('team.notAvailable')}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-text-3">{t('team.clubColors')}</dt>
                                <dd className="mt-1 text-sm font-semibold">{team.clubColors ?? t('team.notAvailable')}</dd>
                            </div>
                        </dl>
                    </section>
                </div>
            </div>

            <section className="rounded-2xl border border-border bg-surface-1">
                <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-accent-text" />
                        <h2 className="font-display text-lg font-bold">{t('team.squad')}</h2>
                    </div>
                    {team.squad.length > 0 && <span className="text-xs text-text-3">{team.squad.length}</span>}
                </div>

                {team.squad.length > 0 ? (
                    <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                        {team.squad.map((player) => (
                            <article key={player.id} className="bg-surface-1 p-4">
                                <p dir="ltr" className="font-semibold">{player.name}</p>
                                <p className="mt-1 text-xs text-text-2">{player.position ?? t('team.player')}</p>
                                {player.nationality && <p className="mt-2 text-[11px] text-text-3">{player.nationality}</p>}
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="p-5">
                        <p className="text-sm text-text-2">{t('team.squadUnavailable')}</p>
                        <p className="mt-2 text-xs leading-relaxed text-text-3">{t('team.squadPlanNote')}</p>
                    </div>
                )}
            </section>

            {favorites.length > 0 && (
                <p className="text-center text-xs text-text-3">
                    {t('team.favoriteCount', { count: favorites.length })}
                </p>
            )}
        </div>
    )
}

export default TeamDetails
