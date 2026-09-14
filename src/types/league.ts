/**
 * Static league metadata for BIG5's 5 supported leagues.
 * Used for the league selector UI now; will also key into
 * real API-Football league IDs once MVP 0.2 wires real data.
 */
export interface League {
    id: string
    name: string
    shortName: string
    country: string
    colorHex: string
}

export const LEAGUES: League[] = [
    { id: 'pl', name: 'Premier League', shortName: 'PL', country: 'England', colorHex: '#38003C' },
    { id: 'laliga', name: 'La Liga', shortName: 'La Liga', country: 'Spain', colorHex: '#EE2523' },
    { id: 'seriea', name: 'Serie A', shortName: 'Serie A', country: 'Italy', colorHex: '#008FD7' },
    { id: 'bundesliga', name: 'Bundesliga', shortName: 'Bundesliga', country: 'Germany', colorHex: '#D3010C' },
    { id: 'ligue1', name: 'Ligue 1', shortName: 'Ligue 1', country: 'France', colorHex: '#091C3E' },
]