import { Link } from 'react-router-dom'
import { Star, Trash2 } from 'lucide-react'
import TeamCrest from '../components/ui/TeamCrest'
import { useFavoriteMatches } from '../hooks/useFavoriteMatches'
import { useLocale } from '../i18n/LocaleProvider'

function Favorites() {
    const { favorites, removeFavorite } = useFavoriteMatches()
    const { t, competitionName, dateLocale } = useLocale()

    return (
        <div className="mx-auto w-full max-w-2xl space-y-5 p-4 pb-24 lg:pb-8">
            <header className="today-hero -mx-4 -mt-4 border-b border-border px-4 py-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent-text">
                    {t('favorites.subtitle')}
                </p>
                <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-text">
                    {t('favorites.title')}
                </h1>
            </header>

            {favorites.length === 0 ? (
                <section className="rounded-2xl border border-border bg-surface-1 p-6">
                    <Star size={26} className="mb-4 text-accent-text" aria-hidden="true" />
                    <h2 className="font-display text-xl font-bold">{t('favorites.emptyTitle')}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-text-2">{t('favorites.emptyBody')}</p>
                </section>
            ) : (
                <ul className="space-y-3">
                    {favorites.map((match) => {
                        const kickoff = new Date(match.kickoff)
                        const date = kickoff.toLocaleDateString(dateLocale, {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                        })
                        const time = kickoff.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })

                        return (
                            <li key={match.id} className="overflow-hidden rounded-2xl border border-border bg-surface-1">
                                <div className="flex items-center gap-3 p-4">
                                    <Link
                                        to={`/match/${match.id}`}
                                        className="min-w-0 flex-1"
                                    >
                                        <p className="mb-3 text-xs text-text-2">
                                            {competitionName(match.competition)} · {date} · <span dir="ltr">{time}</span>
                                        </p>

                                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <TeamCrest team={match.homeTeam} size={30} />
                                                <span dir="ltr" className="truncate text-sm font-semibold">
                                                    {match.homeTeam.shortName}
                                                </span>
                                            </div>

                                            <div dir="ltr" className="font-display text-sm font-bold tabular-nums text-text-2">
                                                {match.status === 'upcoming'
                                                    ? 'vs'
                                                    : `${match.homeScore ?? '—'} : ${match.awayScore ?? '—'}`}
                                            </div>

                                            <div className="flex min-w-0 items-center justify-end gap-2">
                                                <span dir="ltr" className="truncate text-sm font-semibold">
                                                    {match.awayTeam.shortName}
                                                </span>
                                                <TeamCrest team={match.awayTeam} size={30} />
                                            </div>
                                        </div>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => removeFavorite(match.id)}
                                        aria-label={t('favorites.remove')}
                                        className="flex size-10 shrink-0 items-center justify-center rounded-full text-text-3 transition-colors hover:bg-surface-2 hover:text-live"
                                    >
                                        <Trash2 size={17} aria-hidden="true" />
                                    </button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default Favorites