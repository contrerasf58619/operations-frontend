'use client'

import { ChangeEvent, useEffect } from 'react'
import { useUserUadList } from '@/hooks/useUserUadList'
import { useUadContext } from '@/context/uad/UadContext'
import { useGetEmployeeCode } from '@/hooks'

interface UadListProps {
    value?: string | number
    onChange?: (value: string) => void
    allUads?: boolean
}

export function UadList({ value, onChange, allUads }: UadListProps) {
    const { employeeCode } = useGetEmployeeCode()
    const { options, loading } = useUserUadList(Number(employeeCode), allUads)
    const { selectedUad, setSelectedUad } = useUadContext()

    const currentValue =
        value !== undefined && value !== null
            ? String(value)
            : selectedUad !== null && selectedUad !== undefined
              ? String(selectedUad)
              : ''

    useEffect(() => {
        if (options.length === 0) {
            return
        }

        const hasValidSelectedUad = options.some(option => String(option.value) === currentValue)

        if (!hasValidSelectedUad) {
            const defaultValue = String(options[0].value)
            setSelectedUad(options[0].value)
            onChange?.(defaultValue)
        }
    }, [options, currentValue, setSelectedUad, onChange])

    const selectedValue = options.some(option => String(option.value) === currentValue)
        ? currentValue
        : String(options[0]?.value ?? '')

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const nextValue = event.target.value
        setSelectedUad(Number(nextValue))
        onChange?.(nextValue)
    }

    return (
        <select
            name='uad'
            id='uad'
            value={selectedValue}
            onChange={handleChange}
            disabled={options.length === 0}
            className='w-full p-2 border rounded disabled:bg-gray-100 disabled:text-gray-500'
        >
            {loading && options.length === 0 && <option value=''>Loading UADs...</option>}
            {!loading && options.length === 0 && <option value=''>No UADs available</option>}
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            ))}
        </select>
    )
}
