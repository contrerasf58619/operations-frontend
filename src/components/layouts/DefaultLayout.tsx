import { TopBar } from '@/components/UI/TopBar/TopBar'
import { SideBar } from '@/components/UI/SideBar/SideBar'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className='h-screen 2xl:pl-[255px] relative'>
                <div className='border-2 w-full border-gray-100'>
                    <TopBar />
                </div>
                <div className='lg:w-[90%] py-8 mx-auto min-h-[85vh] flex'>
                    <SideBar />
                    <div className='flex-grow'>{children}</div>
                </div>
            </div>
        </div>
    )
}
