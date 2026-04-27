import useSWR from 'swr'
import { coachingSessionApi, User } from '@/api/coachingSession.api'

export const useCoachingUsers = (uadId: number | null, employeeCodeList: string | null) => {
    const { data, error, isLoading, mutate } = useSWR(
        uadId && employeeCodeList ? ['coachingUsers', uadId, employeeCodeList] : null,
        async ([, uadId, employeeCodeList]: [string, number, string]) => {
            const res = await coachingSessionApi.getUserByEmployeeCode(uadId, employeeCodeList)
            return res.data
        },
    )

    return {
        users: data || ([] as User[]),
        loading: isLoading,
        error,
        mutate,
    }
}
