'use client'

import '@/lib/axios-interceptor'
import '@/aws.config'
import { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { ToastProvider } from '@/context/UI/ToastNotificationContext'
import { AuthProvider } from '@/context/auth/AuthContext'

export function Providers({ children, locale }: { children: ReactNode; locale: string }) {
    return (
        <NextIntlClientProvider locale={locale}>
            <ToastProvider>
                <AuthProvider>{children}</AuthProvider>
            </ToastProvider>
        </NextIntlClientProvider>
    )
}