import { useState } from 'react'
import { resolveLeagueEmblem } from '../../utils/leagueEmblems'

/** Official competition artwork with a stable monogram fallback. */
function LeagueEmblem({ src, label, code }: { src?: string; label: string; code?: string }) {
    const [failedSource, setFailedSource] = useState<string>()
    const competitionCode = code ?? (label === 'PL' || label === 'Premier League' ? 'PL' : '')
    const source = resolveLeagueEmblem(competitionCode, src)

    return (
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-3 font-display text-[10px] font-bold text-text">
            {source && failedSource !== source ? (
                <img src={source} alt="" width={16} height={16} className="size-4 object-contain" onError={() => setFailedSource(source)} />
            ) : competitionCode === 'PL' ? 'PL' : label.slice(0, 2).toUpperCase()}
        </span>
    )
}

export default LeagueEmblem
