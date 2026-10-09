import { Link } from 'react-router-dom'
import { Star, Trash2 } from 'lucide-react'
import TeamCrest from '../components/ui/TeamCrest'
import { useFavoriteTeams } from '../hooks/useFavoriteTeams'
import { useLocale } from '../i18n/LocaleProvider'

function Favorites() {
    const { favorites, removeFavorite } = useFavoriteTeams()
    const { t } = useLocale()

    return (
        <div className="mx-auto w-full max-w-4xl space-y-5 p-4 pb-24 lg:p-6 lg:pb-10">
            <header className="today-hero -mx-4 -mt-4 border-b border-border px-4 py-7 lg:-mx-6 lg:-mt-6 lg:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-text">
                    {t('favorites.subtitle')}
                </p>
                <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-text">
                    {t('favorites.title')}
                </h1>
            </header>

            {favorites.length === 0 ? (
                <section className="rounded-2xl border border-border bg-surface-1 p-6">
                    <Star size={28} className="mb-4 text-accent-text" aria-hidden="true" />
                    <h2 className="font-display text-xl font-bold">{t('favorites.emptyTitle')}</h2>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-text-2">{t('favorites.emptyBody')}</p>
                </section>
            ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((team) => (
                        <li key={team.id} className="relative overflow-hidden rounded-2xl border border-border bg-surface-1">
                            <Link
                                to={'/team/' + team.id}
                                className="flex min-h-44 flex-col items-center justify-center gap-3 p-5 text-center transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-text"
                            >
                                <TeamCrest
                                    team={{
                                        id: team.id,
                                        name: team.name,
                                        shortName: team.shortName,
                                        crestUrl: team.crestUrl,
                                    }}
                                    size={58}
                                />
                                <div>
                                    <p dir="ltr" className="font-display text-lg font-extrabold">{team.name}</p>
                                    {team.country && <p className="mt-1 text-xs text-text-3">{team.country}</p>}
                                </div>
                                <span className="text-xs font-semibold text-accent-text">{t('favorites.openTeam')}</span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => removeFavorite(team.id)}
                                aria-label={t('favorites.remove')}
                                className="absolute end-3 top-3 flex size-9 items-center justify-center rounded-full bg-surface-3 text-text-3 transition-colors hover:text-live focus-visible:outline-2 focus-visible:outline-accent-text"
                            >
                                <Trash2 size={16} aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Favorites
