/**
 * LiveIndicator — the BIG5 brand signal (per design brief section 5).
 * Three cues together, never color alone: pulsing dot + "LIVE" label + minute.
 * Uses Tailwind's built-in animate-pulse (2s ease-in-out infinite — matches spec).
 */
function LiveIndicator({ minute }: { minute?: number }) {
    return (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-live/15 px-2 py-0.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-live">
                {minute != null ? `Live ${minute}'` : 'Live'}
            </span>
        </div>
    )
}

export default LiveIndicator