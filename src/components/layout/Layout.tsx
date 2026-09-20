import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'
import InstallPrompt from './InstallPrompt'
import Footer from './Footer'
import PageMeta from './PageMeta'

function Layout() {
    return (
        <div className="flex min-h-dvh flex-col bg-bg">
            <PageMeta />
            <a
                href="#main-content"
                className="sr-only z-[100] rounded-md bg-accent px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
                Skip to main content
            </a>
            <Header />
            <main
                id="main-content"
                tabIndex={-1}
                className="flex-1 pb-20 lg:mx-auto lg:w-full lg:max-w-[1220px] lg:pb-0"
            >
                <Outlet />
            </main>
            <Footer />
            <InstallPrompt />
            <BottomNav />
        </div>
    )
}

export default Layout
