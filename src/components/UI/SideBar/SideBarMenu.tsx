'use client'
import Image from 'next/image'
import Link from 'next/link'

import { alliedLogo } from '@/assets'
import { useSidebarContext } from '@/context/sidebar/SideBarContex'
import { SideBarMenuParent } from './SideBarMenuParent'

export const SideBarMenu = () => {
    const { sidebarState } = useSidebarContext()
    return (
        <>
            <Link href='/' prefetch={false} className='block'>
                <div className='flex items-center justify-center'>
                    <Image src={alliedLogo} alt='logo' className='mr-2 h-10 w-auto' priority />
                </div>
            </Link>

            <ul className='mt-5 space-y-2' key='main-menu'>
                {sidebarState.parents.map((parent: any) => (
                    <SideBarMenuParent key={parent.name} parent={parent} />
                ))}
            </ul>
        </>
    )
}
