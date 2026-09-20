export default async function handler(req: any, res: any) {
    const { path, ...queryParams } = req.query
    const pathSegments = Array.isArray(path) ? path.join('/') : path

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(queryParams)) {
        if (typeof value === 'string') searchParams.set(key, value)
    }
    const queryString = searchParams.toString()

    const targetUrl = `https://api.football-data.org/v4/${pathSegments}${queryString ? `?${queryString}` : ''}`

    const apiResponse = await fetch(targetUrl, {
        headers: { 'X-Auth-Token': process.env.SCHEDULE_API_KEY as string },
    })

    const data = await apiResponse.json()

    res.status(apiResponse.status).json(data)
}