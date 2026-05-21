import { LuX } from 'react-icons/lu'
import type { Filter, FilterFieldConfig } from './filters.types'
import { getOptionLabel } from './filters.utils'

interface FilterPillProps {
    filter: Filter
    field: FilterFieldConfig
    onRemove: (id: string) => void
}

export function FilterPill({ filter, field, onRemove }: FilterPillProps) {
    return (
        <div className='flex items-center overflow-hidden rounded-md border border-gray-200 bg-white text-xs shadow-sm'>
            {/* Left Section: Icon & Field Name (e.g. Supervisor) */}
            <div className='flex items-center gap-1.5 border-r border-gray-200 bg-gray-50 px-2 py-1.5 font-medium text-gray-700'>
                {field.icon && <span className='text-gray-400'>{field.icon}</span>}
                <span>{field.label}</span>
            </div>

            {/* Middle Section: Operator (e.g. is any of) */}
            <div className='border-r border-gray-200 px-2 py-1.5 text-gray-500 bg-white'>
                {filter.operator}
            </div>

            {/* Right Section: Values */}
            <div className='px-2 py-1.5 font-medium text-blue-600 bg-white'>
                {filter.values.length > 0
                    ? filter.values.map(v => getOptionLabel(field, v)).join(', ')
                    : '...'}
            </div>

            {/* Remove Button */}
            <button
                type='button'
                onClick={() => onRemove(filter.id)}
                className='flex h-full items-center justify-center border-l border-gray-200 bg-white px-2 py-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none'
            >
                <LuX className='size-3.5' aria-hidden />
            </button>
        </div>
    )
}
