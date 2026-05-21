import { useState, type ReactNode } from 'react'
import { LuListFilter } from 'react-icons/lu'
import type { Filter, FilterFieldConfig } from './filters.types'
import { FilterDropdown } from './FilterDropdown'
import { FilterPill } from './FilterPill'
import { getFieldConfig } from './filters.utils'

interface FiltersProps {
    fields: FilterFieldConfig[]
    filters: Filter[]
    onChange: (filters: Filter[]) => void
    trigger?: ReactNode
    maxFilters?: number
}

export function Filters({ fields, filters, onChange, trigger, maxFilters }: FiltersProps) {
    const [open, setOpen] = useState(false)
    const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null)

    function handleOpen() {
        setOpen(prev => {
            const next = !prev
            if (!next) setActiveFieldKey(null)
            return next
        })
    }

    function handleClose() {
        setOpen(false)
        setActiveFieldKey(null)
    }

    function handleRemove(id: string) {
        onChange(filters.filter(f => f.id !== id))
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className='relative inline-flex'>
                {trigger ? (
                    <span onClick={handleOpen} className='cursor-pointer'>
                        {trigger}
                    </span>
                ) : (
                    <button
                        type='button'
                        onClick={handleOpen}
                        aria-haspopup='listbox'
                        aria-expanded={open}
                        aria-label='Open filter menu'
                        className='flex size-8 items-center justify-center rounded-md bg-gray-900 text-white transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
                    >
                        <LuListFilter className='size-4' aria-hidden />
                    </button>
                )}

                {open && (
                    <FilterDropdown
                        fields={fields}
                        filters={filters}
                        activeFieldKey={activeFieldKey}
                        onActiveFieldChange={setActiveFieldKey}
                        onChange={onChange}
                        onClose={handleClose}
                        maxFilters={maxFilters}
                    />
                )}
            </div>

            {filters.length > 0 && (
                <div className='flex flex-wrap items-center gap-1.5'>
                    {filters.map(filter => {
                        const field = getFieldConfig(fields, filter.key)
                        if (!field) return null
                        return (
                            <FilterPill
                                key={filter.id}
                                filter={filter}
                                field={field}
                                onRemove={handleRemove}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}
