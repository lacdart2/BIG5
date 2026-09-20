/** CSS floodlights and a faint pitch establish BIG5's matchday atmosphere. */
function Hero() {
    return (
        <section className="today-hero relative isolate overflow-hidden border-b border-border px-5 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14 xl:px-14 xl:py-16">
            <svg aria-hidden="true" viewBox="0 0 240 160" className="pointer-events-none absolute -right-12 bottom-0 -z-10 w-72 -rotate-12 text-accent/15 lg:w-[420px] xl:w-[480px]" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M20 15h200v130H20zM120 15v130M20 50h35v60H20m200-60h-35v60h35" />
                <circle cx="120" cy="80" r="25" />
                <circle cx="120" cy="80" r="2" fill="currentColor" />
            </svg>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-accent-text">Five leagues. One matchday.</p>
            <p aria-label="BIG5" className="font-display text-6xl font-extrabold leading-none tracking-tighter text-text lg:text-8xl">BIG<span className="text-accent">5</span><span aria-hidden="true" className="ml-3 inline-block h-10 w-1 -skew-x-12 bg-accent lg:h-14" /></p>
            <h1 className="mt-4 max-w-80 text-balance font-display text-3xl font-extrabold leading-tight tracking-tight lg:mt-6 lg:max-w-xl lg:text-5xl">The game starts here.</h1>
            <p className="mt-2 max-w-72 text-sm leading-relaxed text-text-2 lg:mt-3 lg:max-w-md lg:text-base">Every fixture. Every race. Your front row to European football.</p>
        </section>
    )
}

export default Hero
