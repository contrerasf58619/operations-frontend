'use client'

import { useSidebarContext } from '@/context/sidebar/SideBarContex'
import { SideBarMenu } from './SideBarMenu'
import { CheckOutsideClick } from '../CheckOutsideClick'

export const SideBar = () => {
    const { toggleSideBar, onCloseSideBar } = useSidebarContext()

    return (
        <CheckOutsideClick onCloseClick={onCloseSideBar}>
            <div
                className={`fixed left-0 top-0 z-50 h-screen w-[264px]
        transform transition-transform duration-300 ease-in-out
        bg-gray-50 border-r border-gray-200 shadow-xl/20 shadow-black/5
        ${toggleSideBar ? 'translate-x-0' : '-translate-x-full'}
        2xl:translate-x-0`}
            >
                {/* Header / Brand */}

                {/* Menu (scrollable) */}
                <div className='flex-1 overflow-y-auto py-4 px-3'>
                    <SideBarMenu />
                </div>

                {/* Footer */}
                <div className='px-4 py-3 border-t border-gray-100 text-center text-[11px] text-gray-500'>
                    v1.0.0 © {new Date().getFullYear()}
                </div>
            </div>
        </CheckOutsideClick>
    )
}
