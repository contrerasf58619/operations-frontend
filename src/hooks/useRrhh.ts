import { rrhhApi } from '@/api/rrhh.api'
import useSWR from 'swr'

export const useMyData = () => {
    const { data, error, isLoading } = useSWR(['getMyData'], async () => {
        const res = await rrhhApi.getMyData()
        return res.data
    })

    return {
        employee: data?.data || null,
        loading: isLoading,
        error,
    }
}
