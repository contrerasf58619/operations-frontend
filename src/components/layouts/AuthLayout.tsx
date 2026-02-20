import { alliedLogo } from '@/assets'
import Image from 'next/image'
import { PropsWithChildren } from 'react'

interface AuthLayoutProps {
    title?: string
    subtitle?: string
}

export const AuthLayout = ({ title, subtitle, children }: PropsWithChildren<AuthLayoutProps>) => {
    return (
        <div className='min-h-screen w-full bg-white text-[#131416] flex items-center justify-center px-6'>
            <div className='w-full max-w-[440px] rounded-2xl shadow-xl border border-gray-100'>
                <div className='flex items-center justify-center gap-3 mt-6'>
                    <Image
                        className='h-[60px] w-[110px]'
                        src={alliedLogo}
                        alt='Allied Global Logo'
                        width={110}
                        height={60}
                    />
                </div>

                {/* Card */}
                <div className='bg-white rounded-2xl p-6 sm:p-8'>
                    {title && <h2 className='text-2xl font-bold'>{title}</h2>}
                    {subtitle && <p className='mt-1 text-sm text-gray-500'>{subtitle}</p>}

                    <div className={title || subtitle ? 'mt-8' : ''}>{children}</div>
                </div>
            </div>
        </div>
    )
}
