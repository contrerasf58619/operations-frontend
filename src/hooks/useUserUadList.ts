import { uadApi } from '@/api/uad.api'
import { useEffect, useState } from 'react'
import { useGetEmployeeCode } from './useGetEmployeeCode'

export function useUserUadList() {
    const [options, setOptions] = useState<{value: number, name: string}[]>([])
    const { employeeCode } = useGetEmployeeCode()
    useEffect(() => {
        //if (!employeeCode) throw new Error('Employee code is required to fetch UADs')
        const resp = uadApi.getUADs(58619).then(resp => {
            const uads = resp.data.data
            setOptions(uads)
        })
    }, [])

    return { options }
}