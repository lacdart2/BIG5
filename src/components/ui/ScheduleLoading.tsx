import { useSyncExternalStore, type ReactNode } from 'react'
import { isScheduleRetrying, subscribeScheduleRetry } from '../../services/scheduleApi'

/** A shared recoverable 429 state, announced while the existing request backs off. */
function ScheduleLoading({ children }: { children: ReactNode }) {
    const retrying = useSyncExternalStore(subscribeScheduleRetry, isScheduleRetrying, () => false)
    return (
        <p role="status" className="text-sm text-text-2">
            {retrying ? 'Still catching up, retrying shortly…' : children}
        </p>
    )
}

export default ScheduleLoading
