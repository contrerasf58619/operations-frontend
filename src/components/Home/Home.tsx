'use client'

import { getInitials } from '@/utils/getInitials'
import Link from 'next/link'
// import { TopBar } from '../UI/TopBar/TopBar'

export type UserSummary = {
    name?: string
    role?: string
    email?: string
    location?: string
    department?: string
}

export const Home = ({ user = {} as UserSummary }: { user?: UserSummary }) => {
    const name = user.name || 'Kunu Lee'
    const role = user.role || 'Software Engineer I'
    const email = user.email || 'kunu.lr@alliedgloba.com'
    const dept = user.department || 'Department'
    const location = user.location || 'Location'

    return (
        <div className='h-[100%] bg-white text-[#131416] flex flex-col'>
            {/* Page container */}
            <main className='flex-1'>
                <div className='max-w-7xl mx-auto px-6 py-8'>
                    {/* Welcome */}
                    <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
                        <div>
                            <h2 className='text-3xl font-bold tracking-tight'>
                                Welcome back{name !== 'Your name' ? `, ${name}` : ''}
                            </h2>
                            <p className='text-gray-600 mt-1'>
                                Here’s a quick overview of your profile and shortcuts.
                            </p>
                        </div>
                    </div>

                    {/* Primary grid */}
                    <section className='mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6'>
                        {/* Profile overview */}
                        <div className='lg:col-span-2 rounded-2xl border border-gray-200 bg-white'>
                            <div className='p-5 grid sm:grid-cols-2 gap-6'>
                                <div className='flex items-center gap-4'>
                                    <div className='h-12 w-12 rounded-xl bg-[#0FA3B1] text-white font-semibold grid place-items-center'>
                                        {getInitials(name)}
                                    </div>
                                    <div>
                                        <div className='font-semibold'>{name}</div>
                                        <div className='text-sm text-gray-500'>{role}</div>
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4 text-sm'>
                                    <InfoRow label='Email' value={email} />
                                    <InfoRow label='Department' value={dept} />
                                    <InfoRow label='Location' value={location} />
                                    <InfoRow label='Status' value='Active' />
                                </div>
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className='rounded-2xl border border-gray-200 bg-white p-5'>
                            <h3 className='font-semibold mb-3'>Quick actions</h3>
                            <div className='grid grid-cols-1 gap-3 text-sm'>
                                <Link
                                    href='/directory'
                                    className='rounded-xl border border-gray-200 px-4 py-3 hover:border-[#0FA3B1]'
                                >
                                    General Report
                                </Link>
                                <Link
                                    href='/teams'
                                    className='rounded-xl border border-gray-200 px-4 py-3 hover:border-[#0FA3B1]'
                                >
                                    Staffed Time
                                </Link>
                                <Link
                                    href='/tickets/new'
                                    className='rounded-xl px-4 py-3 font-semibold text-white bg-gradient-to-r from-[#FFB100] via-[#F08A00] to-[#C96E00] hover:opacity-90'
                                >
                                    Execute Process
                                </Link>
                                <Link
                                    href='/settings'
                                    className='rounded-xl border border-gray-200 px-4 py-3 hover:border-[#0FA3B1]'
                                >
                                    WF Review
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className='border-t border-gray-200 py-6 text-center text-sm text-gray-500'>
                © {new Date().getFullYear()} Allied Global. All rights reserved.
            </footer>
        </div>
    )
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className='text-gray-500'>{label}</div>
            <div className='font-medium'>{value}</div>
        </div>
    )
}
