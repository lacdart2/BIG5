export default async function handler(req: any, res: any) {
    const { endpoint, ...queryParams } = req.query

    if (!endpoint || typeof endpoint !== 'string') {
        return res.status(400).json({ error: 'Missing endpoint parameter' })
    }

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(queryParams)) {
        if (typeof value === 'string') searchParams.set(key, value)
    }
    const queryString = searchParams.toString()

    const targetUrl = `https://api.football-data.org/v4/${endpoint}${queryString ? `?${queryString}` : ''}`

    try {
        const apiResponse = await fetch(targetUrl, {
            headers: { 'X-Auth-Token': process.env.SCHEDULE_API_KEY as string },
        })
        const data = await apiResponse.json()
        res.status(apiResponse.status).json(data)
    } catch (err) {
        res.status(500).json({ error: 'Upstream request failed' })
    }
}