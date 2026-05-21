import { LuX } from 'react-icons/lu'
import type { Filter, FilterFieldConfig } from './filters.types'
import { formatPillLabel, getOptionLabel } from './filters.utils'

interface FilterPillProps {
    filter: Filter
    field: FilterFieldConfig
    onRemove: (id: string) => void
}

export function FilterPill({ filter, field, onRemove }: FilterPillProps) {
    const valuesText = filter.values.map(v => getOptionLabel(field, v)).join(', ')

    return (
        <span
            className='inline-flex items-center gap-1 rounded-full border border-white/10 bg-charcoal px-2 py-1 text-xs text-white'
            aria-label={formatPillLabel(filter, [field])}
        >
            <span className='flex size-3.5 items-center justify-center text-white/70'>
                {field.icon}
            </span>
            <span className='font-medium'>{field.label}</span>
            <span className='text-amber'>{filter.operator}</span>
            {valuesText && <span className='truncate text-cyan'>{valuesText}</span>}
            <button
                type='button'
                onClick={() => onRemove(filter.id)}
                aria-label={`Remove ${field.label} filter`}
                className='ml-1 flex size-4 items-center justify-center rounded text-white/50 transition-colors hover:bg-graphite hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal'
            >
                <LuX className='size-3' aria-hidden />
            </button>
        </span>
    )
}
