import DefaultLayout from '@/components/layouts/DefaultLayout'
import { SidebarProvider } from '@/context/sidebar/SideBarContex'
import { UadProvider } from '@/context/uad/UadContext'
import { DateProvider } from '@/context/UI/DateContext'
import { LoadingProvider } from '@/context/UI/LoadingContext'
import { EmployeeProvider } from '@/context/employee/EmployeeContext'
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
                        <EmployeeProvider>
                            <DefaultLayout>{children}</DefaultLayout>
                        </EmployeeProvider>
                    </DateProvider>
                </UadProvider>
            </SidebarProvider>
        </LoadingProvider>
    )
}
