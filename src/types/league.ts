export interface League {
    id: string
    apiId: number
    name: string
    shortName: string
    country: string
    colorHex: string
    supportsStandings?: boolean
}

export const LEAGUES: League[] = [
    { id: 'pl', apiId: 39, name: 'Premier League', shortName: 'PL', country: 'England', colorHex: '#38003C', supportsStandings: true },
    { id: 'laliga', apiId: 140, name: 'La Liga', shortName: 'La Liga', country: 'Spain', colorHex: '#EE2523', supportsStandings: true },
    { id: 'seriea', apiId: 135, name: 'Serie A', shortName: 'Serie A', country: 'Italy', colorHex: '#008FD7', supportsStandings: true },
    { id: 'bundesliga', apiId: 78, name: 'Bundesliga', shortName: 'Bundesliga', country: 'Germany', colorHex: '#D3010C', supportsStandings: true },
    { id: 'ligue1', apiId: 61, name: 'Ligue 1', shortName: 'Ligue 1', country: 'France', colorHex: '#091C3E', supportsStandings: true },
    { id: 'ucl', apiId: 2001, name: 'UEFA Champions League', shortName: 'UCL', country: 'Europe', colorHex: '#0B1F5E', supportsStandings: false },
]

export const DOMESTIC_LEAGUES = LEAGUES.filter((league) => league.supportsStandings)
