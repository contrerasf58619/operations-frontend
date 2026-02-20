import Link from 'next/link'
import { cookies } from 'next/headers' // Use cookies on server side
import { alliedLogo } from '@/assets'
import Image from 'next/image'

export default async function NotFound() {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-white px-6'>
            {/* Logo placeholder */}
            <div className='mb-8'>
                <Image src={alliedLogo} alt='Allied Global Logo' />
                <div className='h-16 w-16 bg-white/20 rounded-full' />
            </div>

            <h1 className='text-6xl font-bold text-[#F08A00]'>404</h1>
            <h2 className='mt-4 text-2xl font-semibold'>Page Not Found</h2>
            <p className='mt-2 text-center max-w-md'>
                Sorry, we couldn’t find the page you’re looking for. It might have been moved or
                deleted.
            </p>

            {token ? (
                <Link
                    href='/'
                    className='mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-black bg-gradient-to-r from-[#FFB100] via-[#F08A00] to-[#C96E00] hover:shadow-[0_0_0_4px_rgba(23,195,206,0.15)]'
                >
                    Go back home
                </Link>
            ) : (
                <Link
                    href='/login'
                    className='mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-black bg-gradient-to-r from-[#FFB100] via-[#F08A00] to-[#C96E00] hover:shadow-[0_0_0_4px_rgba(23,195,206,0.15)]'
                >
                    Go to login
                </Link>
            )}
        </div>
    )
}
