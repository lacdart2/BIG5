function Footer() {
    return (
        <footer className="border-t border-border">
            <div className="mx-auto flex w-full max-w-[1220px] flex-col items-center justify-between gap-2 px-4 py-5 pb-24 text-xs text-text-3 sm:flex-row lg:px-6 lg:pb-5 xl:px-8">
                <p>
                    Built by <span className="text-text-2">Lakhdar Hafsi</span>
                </p>

                <a
                    href="https://github.com/lacdart2"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Lakhdar Hafsi on GitHub (opens in a new tab)"
                    className="rounded-sm transition-colors duration-150 hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
                >
                    GitHub
                </a>
            </div>
        </footer>
    )
}

export default Footer
