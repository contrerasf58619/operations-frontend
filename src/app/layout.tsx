import { Metadata } from 'next'
import '@/app/globals.css'
import { alliedLogoSVG } from '@/assets'
import { getLocale } from 'next-intl/server'
import { Providers } from '@/app/providers'

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
                <Providers locale={locale}>{children}</Providers>
            </body>
        </html>
    )
}
