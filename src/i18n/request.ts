import { headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

const locales = ['en', 'es'] as const
type AppLocale = (typeof locales)[number]

const defaultLocale: AppLocale = 'en'

function isSupportedLocale(value: string | undefined): value is AppLocale {
    return Boolean(value && locales.includes(value as AppLocale))
}

function getPreferredLocale(acceptLanguage: string | null): AppLocale {
    if (!acceptLanguage) {
        return defaultLocale
    }

    const candidates = acceptLanguage
        .split(',')
        .map(part => part.split(';')[0]?.trim().toLowerCase())
        .flatMap(locale => {
            if (!locale) {
                return []
            }

            const baseLocale = locale.split('-')[0]
            return baseLocale && baseLocale !== locale ? [locale, baseLocale] : [locale]
        })

    const matchedLocale = candidates.find(isSupportedLocale)

    return matchedLocale ?? defaultLocale
}

export default getRequestConfig(async ({ requestLocale }) => {
    const requestedLocale = await requestLocale
    const headerStore = await headers()
    const locale = isSupportedLocale(requestedLocale)
        ? requestedLocale
        : getPreferredLocale(headerStore.get('accept-language'))

    const messages =
        locale === 'es'
            ? (await import('../messages/es.json')).default
            : (await import('../messages/en.json')).default

    return {
        locale,
        messages,
    }
})
