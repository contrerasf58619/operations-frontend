'use client'

import '@/lib/axios-interceptor'
import '@/aws.config'
import { ReactNode } from 'react'
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl'
import { ToastProvider } from '@/context/UI/ToastNotificationContext'
import { AuthProvider } from '@/context/auth/AuthContext'

export function Providers({
    children,
    locale,
    messages,
}: {
    children: ReactNode
    locale: string
    messages?: AbstractIntlMessages
}) {
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <ToastProvider>
                <AuthProvider>{children}</AuthProvider>
            </ToastProvider>
        </NextIntlClientProvider>
    )
}
