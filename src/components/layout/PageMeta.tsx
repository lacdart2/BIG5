import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://big-5-beta.vercel.app'

const ROUTE_META: Record<string, { title: string; description: string }> = {
    '/': {
        title: 'BIG5 Football — Live Scores, Fixtures & Standings',
        description: 'Follow live scores, fixtures and standings from the Premier League, La Liga, Serie A, Bundesliga and Ligue 1 with BIG5 Football.',
    },
    '/week': {
        title: 'This Week’s Football Fixtures — BIG5 Football',
        description: 'Browse upcoming fixtures across the Premier League, La Liga, Serie A, Bundesliga and Ligue 1.',
    },
    '/live': {
        title: 'Live Football Scores — BIG5 Football',
        description: 'Follow live match scores across Europe’s Premier League, La Liga, Serie A, Bundesliga and Ligue 1.',
    },
    '/standings': {
        title: 'Big Five League Standings — BIG5 Football',
        description: 'Check current standings for the Premier League, La Liga, Serie A, Bundesliga and Ligue 1.',
    },
    '/favorites': {
        title: 'Favorite Teams & Matches — BIG5 Football',
        description: 'Keep your favorite BIG5 teams and matches easy to find in one place.',
    },
}

function setMeta(selector: string, value: string) {
    document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value)
}

function PageMeta() {
    const { pathname } = useLocation()

    useEffect(() => {
        const meta = ROUTE_META[pathname] ?? ROUTE_META['/']
        const canonicalUrl = `${SITE_URL}${pathname === '/' ? '/' : pathname}`

        document.title = meta.title
        setMeta('meta[name="description"]', meta.description)
        setMeta('meta[property="og:title"]', meta.title)
        setMeta('meta[property="og:description"]', meta.description)
        setMeta('meta[property="og:url"]', canonicalUrl)
        setMeta('meta[name="twitter:title"]', meta.title)
        setMeta('meta[name="twitter:description"]', meta.description)

        document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonicalUrl)
    }, [pathname])

    return null
}

export default PageMeta
