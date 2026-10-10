import type { Match, Team } from '../types/football'

export interface BeinProgram {
    channelId: number
    channelName: string
    title: string
    category?: string
    time?: string
}

export interface BeinBroadcast {
    channelId: number
    channelName: string
    source: 'beIN MENA'
}

const GUIDE_CACHE_MS = 20 * 60 * 1000
const inFlight = new Map<string, Promise<BeinProgram[]>>()

const ARABIC_BEIN_CHANNELS: Record<number, string> = {
    1: 'beIN SPORTS 1',
    2: 'beIN SPORTS 2',
    3: 'beIN SPORTS 3',
    4: 'beIN SPORTS 4',
    5: 'beIN SPORTS 5',
    6: 'beIN SPORTS 6',
    7: 'beIN SPORTS 7',
    8: 'beIN SPORTS 8',
    9: 'beIN SPORTS 9',
    17: 'beIN SPORTS XTRA 1',
    18: 'beIN SPORTS XTRA 2',
    19: 'beIN SPORTS XTRA 3',
    20: 'beIN SPORTS XTRA 4',
    21: 'beIN SPORTS XTRA 5',
    22: 'beIN SPORTS XTRA 6',
    23: 'beIN SPORTS XTRA 7',
    24: 'beIN SPORTS XTRA 8',
    25: 'beIN SPORTS XTRA 9',
    26: 'beIN SPORTS 4K HDR',
    27: 'beIN SPORTS MAX 1',
    28: 'beIN SPORTS MAX 2',
    29: 'beIN SPORTS MAX 3',
    30: 'beIN SPORTS MAX 4',
}

const STOP_WORDS = new Set([
    'fc', 'cf', 'afc', 'ac', 'sc', 'club', 'football', 'calcio', 'de', 'the',
])

const TEAM_ALIASES: Record<string, string[]> = {
    'manchester city': ['man city'],
    'manchester united': ['man united', 'man utd'],
    'paris saint germain': ['psg', 'paris sg'],
    'internazionale': ['inter', 'inter milan'],
    'internazionale milano': ['inter', 'inter milan'],
    'ac milan': ['milan'],
    'atletico madrid': ['atleti'],
    'athletic club': ['athletic bilbao'],
    'bayern munchen': ['bayern munich', 'bayern'],
    'borussia dortmund': ['dortmund'],
    'rb leipzig': ['leipzig'],
    'olympique lyonnais': ['lyon'],
    'olympique de marseille': ['marseille'],
    'paris fc': ['paris fc'],
}

function cacheKey(date: string) {
    return `big5-bein-guide:${date}`
}

function readCache(date: string): BeinProgram[] | null {
    try {
        const raw = sessionStorage.getItem(cacheKey(date))
        if (!raw) return null
        const parsed = JSON.parse(raw) as { timestamp: number; programs: BeinProgram[] }
        if (Date.now() - parsed.timestamp > GUIDE_CACHE_MS) return null
        return parsed.programs
    } catch {
        return null
    }
}

function writeCache(date: string, programs: BeinProgram[]) {
    try {
        sessionStorage.setItem(cacheKey(date), JSON.stringify({
            timestamp: Date.now(),
            programs,
        }))
    } catch {
        // The guide is optional enrichment. Ignore storage failures.
    }
}

function text(element: Element | null): string {
    return element?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
}

function parseGuide(html: string): BeinProgram[] {
    const document = new DOMParser().parseFromString(html, 'text/html')
    const programs: BeinProgram[] = []

    for (const [idText, channelName] of Object.entries(ARABIC_BEIN_CHANNELS)) {
        const channelId = Number(idText)
        const channel = document.querySelector(`#channels_${channelId}`)
        if (!channel) continue

        const primaryItems = channel.querySelectorAll('.slider > ul:first-child > li')
        const items = primaryItems.length > 0 ? primaryItems : channel.querySelectorAll('li')

        items.forEach((item) => {
            const title = text(item.querySelector('.title'))
            if (!title) return

            const timeText = text(item.querySelector('.time'))
            const time = timeText.match(/\b(\d{1,2}:\d{2})\b/)?.[1]
            const category = text(item.querySelector('.format')) || undefined

            programs.push({
                channelId,
                channelName,
                title,
                category,
                time,
            })
        })
    }

    return programs
}

export async function fetchBeinGuide(date: string): Promise<BeinProgram[]> {
    const cached = readCache(date)
    if (cached) return cached

    const pending = inFlight.get(date)
    if (pending) return pending

    const request = fetch(`/api/bein-guide?date=${encodeURIComponent(date)}&lang=ar`)
        .then(async (response) => {
            if (!response.ok) throw new Error(`beIN guide error: ${response.status}`)
            const data = await response.json() as { html?: string }
            const programs = parseGuide(data.html ?? '')
            writeCache(date, programs)
            return programs
        })
        .finally(() => {
            inFlight.delete(date)
        })

    inFlight.set(date, request)
    return request
}

function normalize(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

function meaningfulTokens(value: string): string[] {
    return normalize(value)
        .split(' ')
        .filter((token) => token.length >= 3 && !STOP_WORDS.has(token))
}

function candidates(team: Team): string[] {
    const raw = new Set<string>([team.name, team.shortName])
    const normalizedName = normalize(team.name)
    const normalizedShort = normalize(team.shortName)

    for (const key of [normalizedName, normalizedShort]) {
        for (const alias of TEAM_ALIASES[key] ?? []) raw.add(alias)
    }

    return [...raw]
        .map(normalize)
        .filter((value) => value.length >= 3)
}

function teamMatchesTitle(team: Team, normalizedTitle: string): boolean {
    const names = candidates(team)
    if (names.some((name) => normalizedTitle.includes(name))) return true

    const teamTokens = [...new Set(
        names.flatMap(meaningfulTokens)
    )]

    if (teamTokens.length === 0) return false

    const titleTokens = new Set(meaningfulTokens(normalizedTitle))
    const matches = teamTokens.filter((token) => titleTokens.has(token)).length

    if (teamTokens.length === 1) return matches === 1
    return matches >= Math.min(2, teamTokens.length)
}

function qatarKickoffMinutes(iso: string): number {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Qatar',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).formatToParts(new Date(iso))

    const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0)
    const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0)
    return hour * 60 + minute
}

function clockMinutes(value?: string): number | null {
    if (!value) return null
    const [hour, minute] = value.split(':').map(Number)
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null
    return hour * 60 + minute
}

function clockDistance(a: number, b: number): number {
    const direct = Math.abs(a - b)
    return Math.min(direct, 1440 - direct)
}

export function getBeinGuideDate(kickoff: string): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Qatar',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date(kickoff))

    const year = parts.find((part) => part.type === 'year')?.value
    const month = parts.find((part) => part.type === 'month')?.value
    const day = parts.find((part) => part.type === 'day')?.value
    return `${year}-${month}-${day}`
}

export function findBeinBroadcasts(match: Match, programs: BeinProgram[]): BeinBroadcast[] {
    const kickoffMinutes = qatarKickoffMinutes(match.kickoff)

    const candidates = programs
        .filter((program) => {
            const title = normalize(program.title)
            return teamMatchesTitle(match.homeTeam, title) && teamMatchesTitle(match.awayTeam, title)
        })
        .map((program) => {
            const programMinutes = clockMinutes(program.time)
            const distance = programMinutes == null
                ? 0
                : clockDistance(kickoffMinutes, programMinutes)

            return { program, distance }
        })
        .filter(({ distance }) => distance <= 180)
        .sort((a, b) => a.distance - b.distance)

    const seen = new Set<number>()
    const broadcasts: BeinBroadcast[] = []

    for (const { program } of candidates) {
        if (seen.has(program.channelId)) continue
        seen.add(program.channelId)
        broadcasts.push({
            channelId: program.channelId,
            channelName: program.channelName,
            source: 'beIN MENA',
        })
    }

    return broadcasts
}
