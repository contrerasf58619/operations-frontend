import { rrhhApi } from '@/api/rrhh.api'
import useSWR from 'swr'

export const useEmployeeByCode = (code: string | undefined) => {
    const { data, error, isLoading } = useSWR(
        code ? ['employeeByCode', code] : null,
        async ([, code]) => {
            const res = await rrhhApi.getEmployeeByCode(code as string)
            return res.data
        },
    )

    return {
        employee: data?.data || null,
        loading: isLoading,
        error,
    }
}
