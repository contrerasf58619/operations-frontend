'use client'
import { uadApi } from '@/api/uad.api'
import { useEffect, useState } from 'react'
import { useGetEmployeeCode } from './useGetEmployeeCode'

type UadOption = {
    value: number
    name: string
}

function dedupeUadOptions(options: UadOption[]): UadOption[] {
    const seenValues = new Set<number>()

    return options.filter(option => {
        if (seenValues.has(option.value)) {
            return false
        }

        seenValues.add(option.value)
        return true
    })
}

function normalizeUadOption(option: any): UadOption | null {
    const value = Number(option?.value ?? option?.id ?? option?.uadId ?? option?.uad_id)
    const name = option?.name ?? option?.label ?? option?.uadName ?? option?.description

    if (!Number.isFinite(value) || !name) {
        return null
    }

    return {
        value,
        name: String(name),
    }
}

export function useUserUadList() {
    const [options, setOptions] = useState<UadOption[]>([])
    const [loading, setLoading] = useState(false)
    const { employeeCode } = useGetEmployeeCode()

    useEffect(() => {
        let isMounted = true

        const fetchUads = async () => {
            setLoading(true)

            try {
                const [allUadsResponse, userUadsResponse] = await Promise.all([
                    uadApi.getAllUADs(),
                    employeeCode !== undefined
                        ? uadApi.getUADs(employeeCode)
                        : Promise.resolve({ data: { status: 200, data: [] } }),
                ])

                const allUads = Array.isArray(allUadsResponse.data?.data)
                    ? allUadsResponse.data.data
                    : []
                const userUads = Array.isArray(userUadsResponse.data?.data)
                    ? userUadsResponse.data.data
                    : []

                const normalizedUads = dedupeUadOptions(
                    [...userUads, ...allUads]
                        .map(normalizeUadOption)
                        .filter((option: UadOption | null): option is UadOption => option !== null),
                )

                if (isMounted) {
                    setOptions(normalizedUads)
                }
            } catch (error) {
                console.error('Error fetching UADs by employee:', error)

                if (isMounted) {
                    setOptions([])
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchUads()

        return () => {
            isMounted = false
        }
    }, [employeeCode])

    return { options, loading, employeeCode }
}
