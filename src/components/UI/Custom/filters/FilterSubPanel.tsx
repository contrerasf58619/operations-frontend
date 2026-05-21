import { useMemo, useState } from 'react'
import { LuCheck, LuSearch } from 'react-icons/lu'
import type { FilterFieldConfig } from './filters.types'

interface FilterSubPanelProps {
    field: FilterFieldConfig
    selectedValues: string[]
    onToggle: (value: string) => void
}

export function FilterSubPanel({ field, selectedValues, onToggle }: FilterSubPanelProps) {
    const [query, setQuery] = useState('')

    const filtered = useMemo(() => {
        const options = field.options ?? []
        const q = query.trim().toLowerCase()
        if (!q) return options
        return options.filter(o => o.label.toLowerCase().includes(q))
    }, [field.options, query])

    return (
        <div
            className='absolute left-full top-0 ml-1 w-64 rounded-md border border-white/10 bg-charcoal p-1.5 shadow-2xl shadow-black/50'
            role='dialog'
            aria-label={`${field.label} options`}
        >
            <div className='relative mb-1.5'>
                <LuSearch
                    className='pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-white/40'
                    aria-hidden
                />
                <input
                    type='text'
                    autoFocus
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={`Search ${field.label.toLowerCase()}…`}
                    className='w-full rounded bg-graphite py-1.5 pl-7 pr-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal'
                />
            </div>

            <ul
                role='listbox'
                aria-multiselectable
                className='max-h-64 space-y-0.5 overflow-y-auto pr-0.5'
            >
                {filtered.length === 0 && (
                    <li className='px-2 py-2 text-center text-xs text-white/40'>No results</li>
                )}
                {filtered.map(option => {
                    const selected = selectedValues.includes(option.value)
                    return (
                        <li key={option.value} role='option' aria-selected={selected}>
                            <button
                                type='button'
                                onClick={() => onToggle(option.value)}
                                className='flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-white/90 transition-colors hover:bg-graphite focus:outline-none focus-visible:ring-2 focus-visible:ring-teal'
                            >
                                <span
                                    className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                        selected
                                            ? 'border-cyan bg-cyan text-charcoal'
                                            : 'border-white/30 bg-transparent'
                                    }`}
                                    aria-hidden
                                >
                                    {selected && <LuCheck className='size-3' strokeWidth={3} />}
                                </span>
                                {option.avatar ? (
                                    <img
                                        src={option.avatar}
                                        alt=''
                                        className='size-4 shrink-0 rounded-full object-cover'
                                    />
                                ) : option.icon ? (
                                    <span className='flex size-4 shrink-0 items-center justify-center text-white/70'>
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
