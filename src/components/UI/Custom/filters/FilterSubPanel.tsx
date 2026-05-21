import { useEffect, useMemo, useState, useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import { LuCheck, LuSearch } from 'react-icons/lu'
import type { FilterFieldConfig } from './filters.types'

interface FilterSubPanelProps {
    field: FilterFieldConfig
    selectedValues: string[]
    onToggle: (value: string) => void
}

export function FilterSubPanel({ field, selectedValues, onToggle }: FilterSubPanelProps) {
    const [query, setQuery] = useState('')
    const panelRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [alignLeft, setAlignLeft] = useState(false)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    useLayoutEffect(() => {
        const checkBounds = () => {
            if (!panelRef.current) return
            const rect = panelRef.current.getBoundingClientRect()

            // If the panel extends past the right edge of the viewport (with a 10px buffer), flip it to the left
            if (!alignLeft && rect.right > window.innerWidth - 10) {
                setAlignLeft(true)
            }
        }

        checkBounds()
        window.addEventListener('resize', checkBounds)
        return () => window.removeEventListener('resize', checkBounds)
    }, [alignLeft])

    const filtered = useMemo(() => {
        const options = field.options ?? []
        const q = query.trim().toLowerCase()
        if (!q) return options
        return options.filter(o => o.label.toLowerCase().includes(q))
    }, [field.options, query])

    return (
        <div
            ref={panelRef}
            className={`absolute top-0 w-64 rounded-md border border-gray-200 bg-white p-1.5 shadow-xl ${
                alignLeft ? 'right-full mr-1' : 'left-full ml-1'
            }`}
            role='dialog'
            aria-label={`${field.label} options`}
        >
            <div className='relative mb-1.5'>
                <LuSearch
                    className='pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-gray-400'
                    aria-hidden
                />
                <input
                    ref={inputRef}
                    type='text'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={`Search ${field.label.toLowerCase()}…`}
                    className='w-full rounded border border-gray-200 bg-gray-50 py-1.5 pl-7 pr-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                />
            </div>

            <ul
                role='listbox'
                aria-multiselectable
                className='max-h-64 space-y-0.5 overflow-y-auto pr-0.5'
            >
                {filtered.length === 0 && (
                    <li className='px-2 py-2 text-center text-xs text-gray-400'>No results</li>
                )}
                {filtered.map(option => {
                    const selected = selectedValues.includes(option.value)
                    return (
                        <li key={option.value} role='option' aria-selected={selected}>
                            <button
                                type='button'
                                onClick={() => onToggle(option.value)}
                                className='flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
                            >
                                <span
                                    className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                        selected
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-gray-300 bg-white'
                                    }`}
                                    aria-hidden
                                >
                                    {selected && <LuCheck className='size-3' strokeWidth={3} />}
                                </span>
                                {option.avatar ? (
                                    <Image
                                        src={option.avatar}
                                        alt=''
                                        width={16}
                                        height={16}
                                        className='size-4 shrink-0 rounded-full object-cover'
                                    />
                                ) : option.icon ? (
                                    <span className='flex size-4 shrink-0 items-center justify-center text-gray-400'>
                                        {option.icon}
                                    </span>
                                ) : null}
                                <span className='flex-1 truncate'>{option.label}</span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
