import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'
import InstallPrompt from './InstallPrompt'

function Layout() {
    return (
        <div className="mx-auto flex min-h-dvh max-w-xl flex-col bg-bg">
            <Header />
            <main className="flex-1 pb-20">
                <Outlet />
            </main>
            <InstallPrompt />
            <BottomNav />
        </div>
    )
}

export default Layout