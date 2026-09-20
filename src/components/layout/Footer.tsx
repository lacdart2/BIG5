function Footer() {
    return (
        <footer className="border-t border-border">
            <div className="mx-auto flex w-full max-w-[1220px] flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-text-3 sm:flex-row lg:px-6 xl:px-8">
                <p>
                    Built by <span className="text-text-2">Lakhdar Hafsi</span>
                </p>

                <a
                    href="https://github.com/lacdart2"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors duration-150 hover:text-accent-text"
                >
                    GitHub
                </a>
            </div>
        </footer>
    )
}

export default Footer