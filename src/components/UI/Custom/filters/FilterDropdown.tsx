import { useEffect, useMemo, useRef, useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import type { Filter, FilterFieldConfig } from './filters.types'
import { FilterFieldItem } from './FilterFieldItem'
import { FilterSubPanel } from './FilterSubPanel'
import { createFilter, defaultOperatorFor } from './filters.utils'

interface FilterDropdownProps {
    fields: FilterFieldConfig[]
    filters: Filter[]
    activeFieldKey: string | null
    onActiveFieldChange: (key: string | null) => void
    onChange: (filters: Filter[]) => void
    onClose: () => void
    maxFilters?: number
}

export function FilterDropdown({
    fields,
    filters,
    activeFieldKey,
    onActiveFieldChange,
    onChange,
    onClose,
    maxFilters,
}: FilterDropdownProps) {
    const panelRef = useRef<HTMLDivElement | null>(null)
    const [query, setQuery] = useState('')
    const [textDraft, setTextDraft] = useState('')

    useEffect(() => {
        function handleMouseDown(e: MouseEvent) {
            if (!panelRef.current) return
            if (!panelRef.current.contains(e.target as Node)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handleMouseDown)
        return () => document.removeEventListener('mousedown', handleMouseDown)
    }, [onClose])

    useEffect(() => {
        setTextDraft('')
    }, [activeFieldKey])

    const activeField = useMemo(
        () => fields.find(f => f.key === activeFieldKey) ?? null,
        [fields, activeFieldKey],
    )

    const filteredFields = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return fields
        return fields.filter(f => f.label.toLowerCase().includes(q))
    }, [fields, query])

    const limitReached = typeof maxFilters === 'number' && filters.length >= maxFilters

    function commitTextFilter(field: FilterFieldConfig, value: string) {
        const trimmed = value.trim()
        if (!trimmed) return
        if (field.validation) {
            const result = field.validation(trimmed)
            if (!result.valid) return
        }
        if (limitReached) return

        const existing = filters.find(f => f.key === field.key)
        if (existing) {
            onChange(filters.map(f => (f.id === existing.id ? { ...f, values: [trimmed] } : f)))
        } else {
            onChange([
                ...filters,
                createFilter(field.key, defaultOperatorFor(field.type), [trimmed]),
            ])
        }
        onActiveFieldChange(null)
        setTextDraft('')
        onClose()
    }

    function toggleMultiValue(field: FilterFieldConfig, value: string) {
        const existing = filters.find(f => f.key === field.key)

        if (!existing) {
            if (limitReached) return
            onChange([...filters, createFilter(field.key, defaultOperatorFor(field.type), [value])])
            return
        }

        const hasValue = existing.values.includes(value)
        const nextValues = hasValue
            ? existing.values.filter(v => v !== value)
            : [...existing.values, value]

        if (nextValues.length === 0) {
            onChange(filters.filter(f => f.id !== existing.id))
            return
        }

        onChange(filters.map(f => (f.id === existing.id ? { ...f, values: nextValues } : f)))
    }

    function setSingleValue(field: FilterFieldConfig, value: string) {
        const existing = filters.find(f => f.key === field.key)
        if (existing) {
            onChange(filters.map(f => (f.id === existing.id ? { ...f, values: [value] } : f)))
        } else {
            if (limitReached) return
            onChange([...filters, createFilter(field.key, defaultOperatorFor(field.type), [value])])
        }
        onActiveFieldChange(null)
        onClose()
    }

    const selectedValuesForActive = activeField
        ? (filters.find(f => f.key === activeField.key)?.values ?? [])
        : []

    return (
        <div
            ref={panelRef}
            role='dialog'
            aria-label='Filter options'
            className='absolute left-0 top-full z-50 mt-1 w-56 rounded-md border border-gray-200 bg-white p-1.5 shadow-xl'
        >
            {/* Inline text input for `text` fields */}
            {activeField && activeField.type === 'text' ? (
                <div className='space-y-1.5'>
                    <div className='flex items-center gap-1.5 px-1 py-0.5 text-xs text-gray-500'>
                        <span className='flex size-4 items-center justify-center text-gray-400'>
                            {activeField.icon}
                        </span>
                        <span>{activeField.label}</span>
                    </div>
                    <input
                        type='text'
                        autoFocus
                        value={textDraft}
                        onChange={e => setTextDraft(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                commitTextFilter(activeField, textDraft)
                            }
                            if (e.key === 'Escape') {
                                e.preventDefault()
                                onActiveFieldChange(null)
                            }
                        }}
                        placeholder={activeField.placeholder ?? 'Type a value…'}
                        className={`w-full rounded border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            activeField.className ?? ''
                        }`}
                    />
                    <button
                        type='button'
                        onClick={() => commitTextFilter(activeField, textDraft)}
                        disabled={!textDraft.trim()}
                        className='w-full rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
                    >
                        Apply
                    </button>
                </div>
            ) : activeField && activeField.type === 'select-single' ? (
                <ul role='listbox' className='max-h-64 space-y-0.5 overflow-y-auto'>
                    {(activeField.options ?? []).map(option => {
                        const selected =
                            filters.find(f => f.key === activeField.key)?.values[0] === option.value
                        return (
                            <li key={option.value} role='option' aria-selected={selected}>
                                <button
                                    type='button'
                                    onClick={() => setSingleValue(activeField, option.value)}
                                    className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                        selected
                                            ? 'bg-blue-50 font-medium text-blue-600'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {option.icon && (
                                        <span className='flex size-4 items-center justify-center text-gray-400'>
                                            {option.icon}
                                        </span>
                                    )}
                                    <span className='flex-1 truncate'>{option.label}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <>
                    {/* Field search */}
                    <div className='relative mb-1.5'>
                        <LuSearch
                            className='pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-gray-400'
                            aria-hidden
                        />
                        <input
                            type='text'
                            autoFocus
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder='Filter…'
                            className='w-full rounded border border-gray-200 bg-gray-50 py-1.5 pl-7 pr-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                        />
                    </div>

                    {/* Field list */}
                    <ul className='space-y-0.5' role='menu'>
                        {filteredFields.length === 0 && (
                            <li className='px-2 py-2 text-center text-xs text-gray-400'>
                                No fields
                            </li>
                        )}
                        {filteredFields.map(field => (
                            <li key={field.key}>
                                <FilterFieldItem
                                    icon={field.icon}
                                    label={field.label}
                                    showArrow={field.type !== 'text'}
                                    onClick={() => onActiveFieldChange(field.key)}
                                />
                            </li>
                        ))}
                    </ul>

                    {limitReached && (
                        <p className='mt-1.5 px-2 text-[10px] text-amber-600'>
                            Filter limit reached
                        </p>
                    )}
                </>
            )}

            {/* Sub-panel for multi-select */}
            {activeField && activeField.type === 'select-multi' && (
                <FilterSubPanel
                    field={activeField}
                    selectedValues={selectedValuesForActive}
                    onToggle={v => toggleMultiValue(activeField, v)}
                />
            )}
        </div>
    )
}
