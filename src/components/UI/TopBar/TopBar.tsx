'use client'

import { useState } from 'react'
import Link from 'next/link'

import Icons from '@/utils/icons'
import { useSidebarContext } from '@/context/sidebar/SideBarContex'
import { getInitials } from '@/utils/getInitials'
import { useAuthContext } from '@/context/auth/AuthContext'
import { CheckOutsideClick } from '../CheckOutsideClick'
import { useEmployeeContext } from '@/context/employee/EmployeeContext'

export const TopBar = () => {
    const { employee } = useEmployeeContext()
    const name = `${employee?.employee.contacto.NOMBRE1} ${employee?.employee.contacto.APELLIDO1}`
    const { onOpenSideBar } = useSidebarContext()
    const [openMenu, setOpenMenu] = useState<boolean>(false)
    const { handleLogout } = useAuthContext()

    const handleMenuOpen = () => {
        setOpenMenu(false)
    }

    return (
        <CheckOutsideClick onCloseClick={handleMenuOpen}>
            <header className='sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3'>
                    {/* Mobile: hamburger */}
                    <button
                        onClick={onOpenSideBar}
                        className='-ml-1 p-2 rounded-lg hover:bg-gray-100 active:bg-gray-100 2xl:hidden'
                        aria-label='Open menu'
                    >
                        <Icons.IoIosMenu className='w-7 h-7' />
                    </button>

                    {/* Brand */}
                    <Link href='/' className='flex items-center gap-2'>
                        <span className='h-7 w-7 rounded-lg bg-gradient-to-br from-[#FFB100] via-[#F08A00] to-[#C96E00]' />
                        <span className='text-base sm:text-lg font-semibold tracking-tight text-[#131416]'>
                            ITS
                        </span>
                    </Link>

                    {/* Search (desktop) */}
                    <div className='ml-auto hidden md:block max-w-md w-full'>
                        <div className='relative'>
                            <input
                                className='w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 outline-none focus:border-[#0FA3B1] focus:ring-2 focus:ring-[#0FA3B1]/40'
                                placeholder='Search…'
                            />
                            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs'>
                                ⌘K
                            </span>
                        </div>
                    </div>

                    {/* Search icon (mobile) */}
                    <button
                        className='ml-auto md:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-100'
                        aria-label='Search'
                    >
                        <Icons.FiSearch className='w-5 h-5 text-gray-500' />
                    </button>

                    {/* Avatar + Dropdown */}
                    <div className='relative'>
                        <button
                            onClick={() => setOpenMenu(v => !v)}
                            className='ml-1 h-9 w-9 rounded-full bg-[#0FA3B1] text-white font-semibold grid place-items-center focus:outline-none focus:ring-2 focus:ring-[#0FA3B1]/40'
                            aria-haspopup='menu'
                            aria-expanded={openMenu}
                        >
                            {getInitials(name)}
                        </button>

                        {openMenu && (
                            <div
                                role='menu'
                                className='absolute right-0 mt-2 z-20 w-56 rounded-xl border border-gray-200 bg-white shadow-xl shadow-black/5 overflow-hidden'
                            >
                                <div className='px-4 py-3 border-b border-gray-100'>
                                    <div className='text-sm font-semibold text-[#131416]'>
                                        {name}
                                    </div>
                                    <div className='text-xs text-gray-500'>Profile</div>
                                </div>

                                <div className='p-1'>
                                    <Link
                                        href='/change-password'
                                        onClick={() => setOpenMenu(false)}
                                        className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#131416] hover:bg-gray-50'
                                    >
                                        <Icons.FiLock className='h-4 w-4 text-gray-500' />
                                        <span>Change password</span>
                                    </Link>

                                    <button
                                        onClick={async () => {
                                            setOpenMenu(false)
                                            try {
                                                await handleLogout()
                                            } catch {
                                                // silenciar errores de logout
                                            }
                                        }}
                                        className='flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-[#B42318] hover:bg-red-50'
                                    >
                                        <Icons.FiLogOut className='h-4 w-4' />
                                        <span>Log out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </CheckOutsideClick>
    )
}
