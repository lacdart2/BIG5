import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Star, Trophy, UserRound } from 'lucide-react'
import LeagueEmblem from '../components/ui/LeagueEmblem'
import ScheduleLoading from '../components/ui/ScheduleLoading'
import TeamCrest from '../components/ui/TeamCrest'
import LiveIndicator from '../components/ui/LiveIndicator'
import { fetchMatchDetails, scheduleErrorMessage } from '../services/scheduleApi'
import { useFavoriteMatches } from '../hooks/useFavoriteMatches'
import { useLocale } from '../i18n/LocaleProvider'
import type { MatchDetails } from '../types/football'

function MatchDetailsPage() {
    const { matchId } = useParams()
    const [match, setMatch] = useState<MatchDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { isFavorite, toggleFavorite } = useFavoriteMatches()
    const { t, competitionName, dateLocale, isRTL } = useLocale()

    useEffect(() => {
        if (!matchId) return
        let active = true
        setIsLoading(true)
        setError(null)

        fetchMatchDetails(matchId)
            .then((result) => { if (active) setMatch(result) })
            .catch((error) => {
                if (active) setError(scheduleErrorMessage(error, t('matchDetails.error')))
            })
            .finally(() => { if (active) setIsLoading(false) })

        return () => { active = false }
    }, [matchId, t])

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-2xl p-4">
                <div className="rounded-2xl border border-border bg-surface-1 p-6">
                    <ScheduleLoading>{t('matchDetails.loading')}</ScheduleLoading>
                </div>
            </div>
        )
    }

    if (error || !match) {
        return (
            <div className="mx-auto w-full max-w-2xl p-4">
                <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-text">
                    <ArrowLeft size={16} className={isRTL ? '-scale-x-100' : ''} />
                    {t('matchDetails.back')}
                </Link>
                <div className="rounded-2xl border border-border bg-surface-1 p-6">
                    <p className="text-sm text-text-2">{error ?? t('matchDetails.error')}</p>
                </div>
            </div>
        )
    }

    const favorite = isFavorite(match.id)
    const kickoff = new Date(match.kickoff)
    const dateLabel = kickoff.toLocaleDateString(dateLocale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
    const timeLabel = kickoff.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const statusLabel = match.status === 'live'
        ? t('common.live')
        : match.status === 'finished'
            ? t('matchDetails.finished')
            : t('common.upcoming')

    return (
        <div className="mx-auto w-full max-w-2xl space-y-4 p-4 pb-24 lg:pb-8">
            <div className="flex items-center justify-between gap-3">
                <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-accent-text hover:text-text">
                    <ArrowLeft size={18} className={isRTL ? '-scale-x-100' : ''} />
                    {t('matchDetails.back')}
                </Link>

                <button
                    type="button"
                    onClick={() => toggleFavorite(match)}
                    aria-pressed={favorite}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface-1 px-4 text-sm font-semibold text-text transition-colors hover:bg-surface-2"
                >
                    <Star size={17} className={favorite ? 'fill-accent text-accent' : 'text-text-2'} />
                    {favorite ? t('matchDetails.saved') : t('matchDetails.save')}
                </button>
            </div>

            <section className="overflow-hidden rounded-3xl border border-accent/25 bg-surface-1">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-accent/5 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-2">
                        <LeagueEmblem src={match.competitionEmblem} label={match.competition} />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{competitionName(match.competition)}</p>
                            {match.matchday != null && (
                                <p className="text-xs text-text-2">{t('featured.matchday', { count: match.matchday })}</p>
                            )}
                        </div>
                    </div>
                    {match.status === 'live'
                        ? <LiveIndicator minute={match.minute} />
                        : <span className="rounded-full bg-surface-3 px-3 py-1 text-xs font-semibold text-text-2">{statusLabel}</span>}
                </div>

                <div className="today-hero px-5 py-8">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                            <TeamCrest team={match.homeTeam} size={64} />
                            <h1 dir="ltr" className="break-words font-display text-base font-extrabold">{match.homeTeam.name}</h1>
                        </div>

                        <div className="text-center" dir="ltr">
                            {match.status === 'upcoming' ? (
                                <>
                                    <p className="font-display text-4xl font-extrabold">{timeLabel}</p>
                                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-text-2">{t('featured.kickoff')}</p>
                                </>
                            ) : (
                                <>
                                    <p className="flex items-center gap-2 font-display text-5xl font-extrabold tracking-tight">
                                        <span>{match.homeScore ?? '—'}</span>
                                        <span className="text-text-2">:</span>
                                        <span>{match.awayScore ?? '—'}</span>
                                    </p>
                                    <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-text-2">{statusLabel}</p>
                                </>
                            )}
                        </div>

                        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                            <TeamCrest team={match.awayTeam} size={64} />
                            <h1 dir="ltr" className="break-words font-display text-base font-extrabold">{match.awayTeam.name}</h1>
                        </div>
                    </div>

                    <p className="mt-7 text-center text-sm text-text-2">{dateLabel}</p>
                </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface-1 p-5">
                <h2 className="font-display text-lg font-bold">{t('matchDetails.info')}</h2>

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                        <Trophy size={18} className="mt-0.5 shrink-0 text-accent-text" />
                        <div>
                            <dt className="text-xs text-text-2">{t('matchDetails.competition')}</dt>
                            <dd className="mt-1 text-sm font-semibold">{competitionName(match.competition)}</dd>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin size={18} className="mt-0.5 shrink-0 text-accent-text" />
                        <div>
                            <dt className="text-xs text-text-2">{t('matchDetails.venue')}</dt>
                            <dd className="mt-1 text-sm font-semibold">{match.venue ?? t('matchDetails.notAvailable')}</dd>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <UserRound size={18} className="mt-0.5 shrink-0 text-accent-text" />
                        <div>
                            <dt className="text-xs text-text-2">{t('matchDetails.referee')}</dt>
                            <dd className="mt-1 text-sm font-semibold" dir="ltr">{match.referee ?? t('matchDetails.notAvailable')}</dd>
                        </div>
                    </div>

                    <div>
                        <dt className="text-xs text-text-2">{t('matchDetails.attendance')}</dt>
                        <dd className="mt-1 text-sm font-semibold tabular-nums">
                            {match.attendance != null ? match.attendance.toLocaleString(dateLocale) : t('matchDetails.notAvailable')}
                        </dd>
                    </div>
                </dl>

                <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-text-3">
                    {t('matchDetails.providerNote')}
                </p>
            </section>
        </div>
    )
}

export default MatchDetailsPage
