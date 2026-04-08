'use client'
import { uadApi } from '@/api/uad.api'
import { useEffect, useState } from 'react'

type UadOption = {
    value: number
    name: string
}

export function useUserUadList(employeeCode: number, allUads?: boolean) {
    const [options, setOptions] = useState<UadOption[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!employeeCode) {
            return
        }
        const fetchUads = async () => {
            setLoading(true)
            const response = await uadApi.getUADByEmployeeCode(Number(employeeCode), allUads)
            setOptions(response.data.data)
            setLoading(false)
        }

        fetchUads()
    }, [employeeCode, allUads])

    return { options, loading }
}
