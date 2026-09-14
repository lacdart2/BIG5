import type { Team } from '../../types/football'

/**
 * TeamCrest — shows the team's real crest image if available,
 * otherwise falls back to a colored monogram chip (per design brief:
 * "no emoji/placeholder boxes").
 */
function TeamCrest({ team, size = 28 }: { team: Team; size?: number }) {
    if (team.crestUrl) {
        return (
            <img
                src={team.crestUrl}
                alt={team.name}
                width={size}
                height={size}
                className="object-contain"
            />
        )
    }

    const initials = team.shortName.slice(0, 2).toUpperCase()

    return (
        <div
            className="flex items-center justify-center rounded-full font-display text-xs font-bold text-white"
            style={{
                width: size,
                height: size,
                backgroundColor: team.colorHex ?? '#363642',
            }}
        >
            {initials}
        </div>
    )
}

export default TeamCrest