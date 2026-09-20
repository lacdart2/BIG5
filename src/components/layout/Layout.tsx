import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'
import InstallPrompt from './InstallPrompt'
import Footer from './Footer'

function Layout() {
    return (
        <div className="flex min-h-dvh flex-col bg-bg">
            <Header />
            <main className="flex-1 pb-20 lg:mx-auto lg:w-full lg:max-w-[1220px] lg:pb-0">
                <Outlet />
            </main>
            <Footer />
            <InstallPrompt />
            <BottomNav />
        </div>
    )
}

export default Layout