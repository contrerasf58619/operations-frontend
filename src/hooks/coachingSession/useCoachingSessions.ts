import useSWR from 'swr'
import { coachingSessionApi, CoachingSession } from '@/api/coachingSession.api'

export const useCoachingSessions = (uadId: number | null) => {
    const { data, error, isLoading, mutate } = useSWR(
        uadId ? ['coachingSessions', uadId] : null,
        async ([, uadId]) => {
            const res = await coachingSessionApi.getCoachingSessions(uadId as number)
            return res.data
        },
    )

    return {
        sessions: data || ([] as CoachingSession[]),
        loading: isLoading,
        error,
        mutate,
    }
}
