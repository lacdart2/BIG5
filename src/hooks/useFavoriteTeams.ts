import { useEffect, useState } from 'react'
import type { TeamProfile } from '../services/scheduleApi'

const STORAGE_KEY = 'big5-favorite-teams'

export interface FavoriteTeam {
    id: string
    name: string
    shortName: string
    crestUrl?: string
    country?: string
}

function readFavorites(): FavoriteTeam[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function toFavorite(team: TeamProfile): FavoriteTeam {
    return {
        id: team.id,
        name: team.name,
        shortName: team.shortName,
        crestUrl: team.crestUrl,
        country: team.country,
    }
}

export function useFavoriteTeams() {
    const [favorites, setFavorites] = useState<FavoriteTeam[]>(readFavorites)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    }, [favorites])

    function isFavorite(teamId: string) {
        return favorites.some((team) => team.id === teamId)
    }

    function toggleFavorite(team: TeamProfile) {
        setFavorites((current) => {
            const exists = current.some((item) => item.id === team.id)
            if (exists) return current.filter((item) => item.id !== team.id)
            return [toFavorite(team), ...current]
        })
    }

    function removeFavorite(teamId: string) {
        setFavorites((current) => current.filter((team) => team.id !== teamId))
    }

    return {
        favorites,
        isFavorite,
        toggleFavorite,
        removeFavorite,
    }
}
