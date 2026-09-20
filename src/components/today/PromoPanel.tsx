/** Editorial brand panel; no implied account, notification, or paid feature. */
function PromoPanel() {
    return (
        <aside className="today-hero relative flex flex-col overflow-hidden rounded-2xl border border-accent/25 p-5 lg:h-full lg:justify-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-text">From kickoff to the title race</p>
            <p className="mt-2 font-display text-2xl font-extrabold tracking-tight">Five leagues. All the feeling.</p>
            <p className="mt-2 max-w-80 text-sm leading-relaxed text-text-2">The weekend rivalries. The midweek drama. One place to follow it all.</p>
            <p className="mt-5 font-display text-sm font-extrabold tracking-tight">BIG<span className="text-accent">5</span><span className="ml-3 font-sans text-[10px] font-medium uppercase tracking-widest text-text-2">Football, in focus.</span></p>
        </aside>
    )
}

export default PromoPanel
