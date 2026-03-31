'use client'
import { useState, useRef, useEffect } from 'react'
// import Link from 'next/link'

import { useSidebarContext } from '@/context/sidebar/SideBarContex'
import { SideBarMenuChild } from './SideBarMenuChild'
import { MenuParent, MenuChild } from '@/interfaces/sideBar.interface'

interface Props {
    parent: MenuParent
}

export const SideBarMenuParent = ({ parent }: Props) => {
    const { onClickSidebarCollapse } = useSidebarContext()
    const [height, setHeight] = useState('0px')
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (contentRef.current) {
            setHeight(parent.collapsed ? '0px' : `${contentRef.current.scrollHeight}px`)
        }
    }, [parent.collapsed])

    const isOpen = !parent.collapsed

    return (
        <li className='list-none'>
            <button
                className={`w-full group rounded-xl px-3 py-2.5 text-left transition-colors
        ${isOpen ? 'bg-[#0FA3B1]/10' : 'hover:bg-gray-100'}`}
                onClick={() => onClickSidebarCollapse(parent.name)}
            >
                <div className='flex items-center gap-3'>
                    {/* left accent bar on active */}
                    <span
                        className={`h-5 w-1.5 rounded-full transition-colors ${
                            isOpen ? 'bg-[#0FA3B1]' : 'bg-transparent group-hover:bg-gray-300'
                        }`}
                    />
                    <span className='text-[#131416] text-sm font-medium tracking-tight flex items-center gap-2'>
                        {parent.icon}
                        {parent.name}
                    </span>
                    <svg
                        className={`ml-auto h-3.5 w-3.5 text-gray-400 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        aria-hidden
                    >
                        <path
                            fillRule='evenodd'
                            d='M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.94 1.17l-4.18 3.31a.75.75 0 01-.94 0L5.21 8.4a.75.75 0 01.02-1.18z'
                            clipRule='evenodd'
                        />
                    </svg>
                </div>
            </button>

            <div
                className={`overflow-hidden transition-[height] duration-300 ease-in-out ${
                    isOpen ? 'h-auto' : 'h-0'
                }`}
                style={{ height }}
                ref={contentRef}
            >
                <div className='pl-5 pr-2 pt-1 pb-2'>
                    <ul className='space-y-1'>
                        {isOpen &&
                            parent.childs.map((child: MenuChild) => (
                                <SideBarMenuChild child={child} key={child.url} />
                            ))}
                    </ul>
                </div>
            </div>
        </li>
    )
}
