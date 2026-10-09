import { useLocale } from '../i18n/LocaleProvider'

function Favorites() {
    const { t } = useLocale()

    return (
        <div className="mx-auto w-full max-w-xl p-4">
            <h1 className="font-display text-2xl font-bold text-text">{t('favorites.title')}</h1>
        </div>
    )
}
export default Favorites