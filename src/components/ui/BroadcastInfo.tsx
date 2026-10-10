import { useEffect, useMemo, useState } from 'react'
import { Tv } from 'lucide-react'
import { fetchBeinGuide, findBeinBroadcasts, getBeinGuideDate } from '../../services/broadcastApi'
import { useLocale } from '../../i18n/LocaleProvider'
import type { BeinBroadcast } from '../../services/broadcastApi'
import type { Match } from '../../types/football'

function BroadcastInfo({
    match,
    variant = 'badge',
}: {
    match: Match
    variant?: 'badge' | 'panel'
}) {
    const [broadcasts, setBroadcasts] = useState<BeinBroadcast[]>([])
    const [loaded, setLoaded] = useState(false)
    const { t } = useLocale()

    const date = useMemo(() => getBeinGuideDate(match.kickoff), [match.kickoff])

    useEffect(() => {
        let active = true
        setLoaded(false)

        fetchBeinGuide(date)
            .then((programs) => {
                if (!active) return
                setBroadcasts(findBeinBroadcasts(match, programs))
            })
            .catch(() => {
                if (active) setBroadcasts([])
            })
            .finally(() => {
                if (active) setLoaded(true)
            })

        return () => {
            active = false
        }
    }, [date, match])

    if (variant === 'badge') {
        if (!loaded || broadcasts.length === 0) return null
        return (
            <span
                className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-accent/10 px-2 py-1 text-[10px] font-semibold text-accent-text"
                title={t('broadcast.mena')}
            >
                <Tv size={12} aria-hidden="true" />
                <span dir="ltr" className="truncate">{broadcasts[0].channelName}</span>
            </span>
        )
    }

    return (
        <section className="rounded-2xl border border-border bg-surface-1 p-5" aria-labelledby="broadcast-title">
            <div className="flex items-center gap-2">
                <Tv size={19} className="text-accent-text" aria-hidden="true" />
                <h2 id="broadcast-title" className="font-display text-lg font-bold">
                    {t('broadcast.title')}
                </h2>
            </div>

            {!loaded ? (
                <p className="mt-4 text-sm text-text-2">{t('broadcast.loading')}</p>
            ) : broadcasts.length > 0 ? (
                <div className="mt-4 space-y-3">
                    {broadcasts.map((broadcast) => (
                        <div key={broadcast.channelId} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-2 px-4 py-3">
                            <div>
                                <p dir="ltr" className="font-display text-base font-bold text-text">
                                    {broadcast.channelName}
                                </p>
                                <p className="mt-1 text-xs text-text-3">{t('broadcast.mena')}</p>
                            </div>
                            <Tv size={20} className="shrink-0 text-accent-text" aria-hidden="true" />
                        </div>
                    ))}
                    <p className="text-[11px] leading-relaxed text-text-3">{t('broadcast.source')}</p>
                </div>
            ) : (
                <div className="mt-4">
                    <p className="text-sm text-text-2">{t('broadcast.notListed')}</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-text-3">{t('broadcast.source')}</p>
                </div>
            )}
        </section>
    )
}

export default BroadcastInfo
