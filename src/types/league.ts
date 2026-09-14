export interface League {
    id: string
    apiId: number
    name: string
    shortName: string
    country: string
    colorHex: string
}

export const LEAGUES: League[] = [
    { id: 'pl', apiId: 39, name: 'Premier League', shortName: 'PL', country: 'England', colorHex: '#38003C' },
    { id: 'laliga', apiId: 140, name: 'La Liga', shortName: 'La Liga', country: 'Spain', colorHex: '#EE2523' },
    { id: 'seriea', apiId: 135, name: 'Serie A', shortName: 'Serie A', country: 'Italy', colorHex: '#008FD7' },
    { id: 'bundesliga', apiId: 78, name: 'Bundesliga', shortName: 'Bundesliga', country: 'Germany', colorHex: '#D3010C' },
    { id: 'ligue1', apiId: 61, name: 'Ligue 1', shortName: 'Ligue 1', country: 'France', colorHex: '#091C3E' },
]