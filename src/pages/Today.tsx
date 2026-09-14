import MatchCard from '../components/ui/MatchCard'
import LeagueTabs from '../components/layout/LeagueTabs'
import { mockMatches } from '../data/mockMatches'

function Today() {
    return (
        <div className="flex flex-col">
            <LeagueTabs />
            <div className="flex flex-col gap-3 px-4 pb-4">
                {mockMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                ))}
            </div>
        </div>
    )
}

export default Today