import { TopBar } from '@/components/UI/TopBar/TopBar'
import { SideBar } from '@/components/UI/SideBar/SideBar'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className='h-screen 2xl:pl-[255px] relative'>
                <div className='border-2 w-full border-gray-100'>
                    <TopBar />
                </div>
                <div className='w-full py-8 px-4 sm:px-6 lg:px-8 2xl:px-12 min-h-[85vh] flex'>
                    <SideBar />
                    <div className='flex-grow'>{children}</div>
                </div>
            </div>
        </div>
    )
}
