import { uadApi } from '@/api/uad.api'
import { useEffect, useState } from 'react'
import { useGetEmployeeCode } from './useGetEmployeeCode'

export function useUserUadList() {
    const [options, setOptions] = useState<{value: number, name: string}[]>([]);
    const employeeCode = useGetEmployeeCode().employeeCode;

    useEffect(() => {
        if(!employeeCode) return
        const resp = uadApi.getUADs(employeeCode).then(resp => {
            const uads = resp.data.data
            setOptions(uads)
        })
    }, [employeeCode])

    return { options }
}