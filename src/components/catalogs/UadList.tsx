'use client'

import { useEffect } from 'react'
import { useUserUadList } from '@/hooks/useUserUadList'
import { useUadContext } from '@/context/uad/UadContext'

export function UadList() {
    const { options, loading } = useUserUadList()
    const { selectedUad, setSelectedUad } = useUadContext()

    useEffect(() => {
        if (options.length === 0) {
            return
        }

        const hasValidSelectedUad = options.some(option => option.value === selectedUad)

        if (!hasValidSelectedUad) {
            setSelectedUad(options[0].value)
        }
    }, [options, selectedUad, setSelectedUad])

    const selectedValue =
        selectedUad !== null && options.some(option => option.value === selectedUad)
            ? selectedUad
            : (options[0]?.value ?? '')

    return (
        <select
            name='uad'
            id='uad'
            value={selectedValue}
            onChange={event => setSelectedUad(Number(event.target.value))}
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
