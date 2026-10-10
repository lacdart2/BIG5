/// <reference types="node" />

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export default async function handler(req: any, res: any) {
    const date = typeof req.query.date === 'string' ? req.query.date : ''
    const lang = req.query.lang === 'en' ? 'en' : 'ar'

    if (!DATE_RE.test(date)) {
        return res.status(400).json({ error: 'Invalid or missing date parameter' })
    }

    const postid = lang === 'ar' ? '25344' : '25356'
    const params = new URLSearchParams({
        action: 'epg_fetch',
        category: 'sports',
        cdate: date,
        language: lang.toUpperCase(),
        loadindex: '0',
        mins: '00',
        offset: '0',
        postid,
        serviceidentity: 'bein.net',
    })

    const targetUrl = `https://www.bein.com/${lang}/epg-ajax-template/?${params.toString()}`

    try {
        const response = await fetch(targetUrl, {
            headers: {
                Accept: 'text/html,application/xhtml+xml',
                'User-Agent': 'BIG5-Football/1.0 (+https://big-5-beta.vercel.app)',
            },
        })

        if (!response.ok) {
            return res.status(502).json({
                error: 'beIN guide request failed',
                upstreamStatus: response.status,
            })
        }

        const html = await response.text()

        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600')
        return res.status(200).json({
            date,
            lang,
            source: 'bein.com',
            html,
        })
    } catch {
        return res.status(502).json({ error: 'Unable to reach the beIN TV guide' })
    }
}
