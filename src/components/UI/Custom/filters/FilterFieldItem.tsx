import type { ReactNode } from 'react'
import { LuChevronRight } from 'react-icons/lu'

interface FilterFieldItemProps {
    icon: ReactNode
    label: string
    showArrow?: boolean
    onClick: () => void
}

export function FilterFieldItem({ icon, label, showArrow, onClick }: FilterFieldItemProps) {
    return (
        <button
            type='button'
            role='menuitem'
            onClick={onClick}
            className='flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
        >
            <span className='flex size-4 items-center justify-center text-gray-400'>{icon}</span>
            <span className='flex-1 truncate'>{label}</span>
            {showArrow && <LuChevronRight className='size-3.5 text-gray-400' aria-hidden />}
        </button>
    )
}
