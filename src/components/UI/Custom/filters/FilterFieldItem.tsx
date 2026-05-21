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
            className='flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-white/90 transition-colors hover:bg-graphite focus:outline-none focus-visible:ring-2 focus-visible:ring-teal'
        >
            <span className='flex size-4 items-center justify-center text-white/70'>{icon}</span>
            <span className='flex-1 truncate'>{label}</span>
            {showArrow && <LuChevronRight className='size-3.5 text-white/40' aria-hidden />}
        </button>
    )
}
