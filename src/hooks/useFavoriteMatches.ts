import { useEffect, useState } from 'react'
import type { Match } from '../types/football'

const STORAGE_KEY = 'big5-favorite-matches'

export interface FavoriteMatch {
    id: string
    kickoff: string
    status: Match['status']
    competition: string
    competitionEmblem?: string
    homeTeam: Match['homeTeam']
    awayTeam: Match['awayTeam']
    homeScore: number | null
    awayScore: number | null
    leagueApiId: number
}

function readFavorites(): FavoriteMatch[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function toFavorite(match: Match): FavoriteMatch {
    return {
        id: match.id,
        kickoff: match.kickoff,
        status: match.status,
        competition: match.competition,
        competitionEmblem: match.competitionEmblem,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        leagueApiId: match.leagueApiId,
    }
}

export function useFavoriteMatches() {
    const [favorites, setFavorites] = useState<FavoriteMatch[]>(readFavorites)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    }, [favorites])

    function isFavorite(matchId: string) {
        return favorites.some((match) => match.id === matchId)
    }

    function toggleFavorite(match: Match) {
        setFavorites((current) => {
            const exists = current.some((item) => item.id === match.id)
            if (exists) return current.filter((item) => item.id !== match.id)
            return [toFavorite(match), ...current]
        })
    }

    function removeFavorite(matchId: string) {
        setFavorites((current) => current.filter((match) => match.id !== matchId))
    }

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        removeFavorite,
    }
}
