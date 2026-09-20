import { useState } from 'react'
import { resolveLeagueEmblem } from '../../utils/leagueEmblems'

/** Official competition artwork with a stable monogram fallback. */
function LeagueEmblem({ src, label, code }: { src?: string; label: string; code?: string }) {
    const [failedSource, setFailedSource] = useState<string>()
    const competitionCode = code ?? (label === 'PL' || label === 'Premier League' ? 'PL' : '')
    const source = resolveLeagueEmblem(competitionCode, src)
    const hasImage = source && failedSource !== source

    return (
        <span
            aria-hidden="true"
            className={`flex size-11 shrink-0 items-center justify-center rounded-full font-display text-[10px] font-bold text-text ${hasImage ? 'bg-white' : 'bg-surface-3'
                }`}
        >
            {hasImage ? (
                <img src={source} alt="" width={24} height={24} className="size-6 object-contain" onError={() => setFailedSource(source)} />
            ) : competitionCode === 'PL' ? 'PL' : label.slice(0, 2).toUpperCase()}
        </span>
    )
}

export default LeagueEmblem