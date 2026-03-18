import { Metadata } from 'next'
import '@/app/globals.css'
import { ToastProvider } from '@/context/UI/ToastNotificationContext'
import { AuthProvider } from '@/context/auth/AuthContext'

import { alliedLogoSVG } from '@/assets'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'

export const metadata: Metadata = {
    title: 'ATS - Allied Global',
    description: 'ATS Allied Global',
    icons: alliedLogoSVG.src,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale()

    return (
        <html lang={locale} suppressHydrationWarning>
            <body suppressHydrationWarning>
                <NextIntlClientProvider>
                    <ToastProvider>
                        <AuthProvider>{children}</AuthProvider>
                    </ToastProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
