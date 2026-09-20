export default async function handler(req: any, res: any) {
    const { path, ...queryParams } = req.query
    const pathSegments = Array.isArray(path) ? path.join('/') : path

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(queryParams)) {
        if (typeof value === 'string') searchParams.set(key, value)
    }
    const queryString = searchParams.toString()

    const targetUrl = `https://api.football-data.org/v4/${pathSegments}${queryString ? `?${queryString}` : ''}`

    // TEMPORARY diagnostic logging — remove once the real issue is found.
    console.log('[schedule-api] targetUrl:', targetUrl)
    console.log('[schedule-api] has SCHEDULE_API_KEY:', Boolean(process.env.SCHEDULE_API_KEY))
    console.log('[schedule-api] key length:', process.env.SCHEDULE_API_KEY?.length)

    const apiResponse = await fetch(targetUrl, {
        headers: { 'X-Auth-Token': process.env.SCHEDULE_API_KEY as string },
    })

    const data = await apiResponse.json()

    console.log('[schedule-api] upstream status:', apiResponse.status)
    console.log('[schedule-api] upstream body:', JSON.stringify(data).slice(0, 300))

    res.status(apiResponse.status).json(data)
}