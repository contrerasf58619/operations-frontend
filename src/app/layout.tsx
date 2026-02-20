import { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/context/UI/ToastNotificationContext'
import { AuthProvider } from '@/context/auth/AuthContext'

import { alliedLogoSVG } from '@/assets'

export const metadata: Metadata = {
    title: 'ATS - Allied Global',
    description: 'ATS Allied Global',
    icons: alliedLogoSVG.src,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning>
            <body suppressHydrationWarning>
                <ToastProvider>
                    <AuthProvider>{children}</AuthProvider>
                </ToastProvider>
            </body>
        </html>
    )
}
