'use client'
import Link from 'next/link'
import { MenuChild } from '@/interfaces/sideBar.interface'

interface ChildProps {
    child: MenuChild
}

export const SideBarMenuChild = ({ child }: ChildProps) => {
    return (
        <li>
            <Link
                href={child.url}
                prefetch={false}
                className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#131416]
        hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 transition-colors'
            >
                <span className='text-gray-500'>{child.icon}</span>
                <span className='truncate'>{child.name}</span>
            </Link>
        </li>
    )
}
