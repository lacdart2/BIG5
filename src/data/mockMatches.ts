import type { Match } from '../types/football'

/**
 * Temporary mock data — lets us build and test MatchCard's 3 states
 * (upcoming/live/finished) before the real API is wired in MVP 0.2.
 * Delete this file once footballApi.ts replaces it.
 */
export const mockMatches: Match[] = [
    {
        id: '1',
        status: 'live',
        kickoff: new Date().toISOString(),
        minute: 67,
        homeTeam: { id: 'ars', name: 'Arsenal', shortName: 'ARS', colorHex: '#EF0107' },
        awayTeam: { id: 'che', name: 'Chelsea', shortName: 'CHE', colorHex: '#034694' },
        homeScore: 2,
        awayScore: 1,
        competition: 'Premier League',
    },
    {
        id: '2',
        status: 'upcoming',
        kickoff: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        homeTeam: { id: 'rma', name: 'Real Madrid', shortName: 'RMA', colorHex: '#FEBE10' },
        awayTeam: { id: 'bar', name: 'Barcelona', shortName: 'BAR', colorHex: '#A50044' },
        homeScore: null,
        awayScore: null,
        competition: 'La Liga',
    },
    {
        id: '3',
        status: 'finished',
        kickoff: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        homeTeam: { id: 'juv', name: 'Juventus', shortName: 'JUV', colorHex: '#000000' },
        awayTeam: { id: 'mil', name: 'AC Milan', shortName: 'MIL', colorHex: '#FB090B' },
        homeScore: 0,
        awayScore: 3,
        competition: 'Serie A',
    },
]