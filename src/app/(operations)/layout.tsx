import DefaultLayout from '@/components/layouts/DefaultLayout'
import { SidebarProvider } from '@/context/sidebar/SideBarContex'
import { UadProvider } from '@/context/uad/UadContext'
import { DateProvider } from '@/context/UI/DateContext'
import { LoadingProvider } from '@/context/UI/LoadingContext'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'ATS - Allied Global',
    description: 'ATS Allied Global',
}

export default function ATSLayout({ children }: { children: React.ReactNode }) {
    return (
        <LoadingProvider>
            <SidebarProvider>
                <UadProvider>
                    <DateProvider>
                        <DefaultLayout>{children}</DefaultLayout>
                    </DateProvider>
                </UadProvider>
            </SidebarProvider>
        </LoadingProvider>
    )
}
