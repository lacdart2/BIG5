import { useLocale } from '../../i18n/LocaleProvider'

function LiveIndicator({ minute }: { minute?: number }) {
    const { t } = useLocale()

    return (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-live/15 px-2 py-0.5" dir="ltr">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-live">
                {minute != null ? `${t('common.live')} ${minute}'` : t('common.live')}
            </span>
        </div>
    )
}

export default LiveIndicator