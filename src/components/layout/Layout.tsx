import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'
import InstallPrompt from './InstallPrompt'

/**
 * Layout — the app shell. `<Outlet />` is React Router's placeholder:
 * whichever page matches the current URL renders there. Every route
 * in App.tsx is nested inside this Layout, so Header + BottomNav
 * persist across page changes instead of re-rendering each time.
 */
function Layout() {
    return (
        <div className="mx-auto flex min-h-dvh max-w-xl flex-col bg-bg">
            <Header />
            <InstallPrompt />
            <main className="flex-1 pb-20">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    )
}

export default Layout