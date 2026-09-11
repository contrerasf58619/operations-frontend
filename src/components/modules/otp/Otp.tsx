'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { otpApi } from '@/api/otp.api'
import { CodeCard } from './CodeCard'
import { GenerateSecretModal } from './GenerateSecretModal'
import { AppRegistrationModal } from './CreateKeyModal'
import { CreateAppModal } from './CreateAppModal'
import { VerifyCodeModal } from './VerifyCodeModal'
import { useToastContext } from '@/context/UI/ToastNotificationContext'
import { useGetEmployeeCode } from '@/hooks/useGetEmployeeCode'
import type { TotpCodeItem } from '@/interfaces/otp.interface'

export default function TotpWidget() {
    const { employeeCode } = useGetEmployeeCode()
    const userId = Number(employeeCode ?? 0)
    const { toast } = useToastContext()

    const [totpCodes, setTotpCodes] = useState<TotpCodeItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    /* ── keeps a single request in flight per expiry window ── */
    const isFetchingRef = useRef(false)

    /* ── verify modal state ── */
    const [verifySecretId, setVerifySecretId] = useState<number | null>(null)

    /* ── fetch all active codes ── */
    const fetchTotpCodes = useCallback(async () => {
        if (!userId || isFetchingRef.current) return

        isFetchingRef.current = true

        try {
            const { data } = await otpApi.getCodes(userId)
            setTotpCodes(data)
            setLoadError(null)
        } catch (error) {
            console.error('Error fetching 2FA codes', error)
            setLoadError(
                'No se pudieron cargar los códigos. Revisa tu conexión e inténtalo de nuevo.',
            )
        } finally {
            isFetchingRef.current = false
            setIsLoading(false)
        }
    }, [userId])

    useEffect(() => {
        fetchTotpCodes()
    }, [fetchTotpCodes])

    /* ── client-side countdown (1 s tick) ── */
    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setTotpCodes(previousCodes => {
                /* once every code has expired the array stops changing, so the
                   refetch effect below runs once per window instead of every tick */
                if (previousCodes.every(item => item.remainingTime === 0)) {
                    return previousCodes
                }

                return previousCodes.map(item => ({
                    ...item,
                    remainingTime: item.remainingTime > 0 ? item.remainingTime - 1 : 0,
                }))
            })
        }, 1000)

        return () => clearInterval(countdownInterval)
    }, [])

    /* ── re-fetch when any code expires ── */
    useEffect(() => {
        const hasExpiredCode = totpCodes.some(item => item.remainingTime === 0)
        if (hasExpiredCode) {
            fetchTotpCodes()
        }
    }, [totpCodes, fetchTotpCodes])

    const handleRetry = () => {
        setIsLoading(true)
        fetchTotpCodes()
    }

    const handleOpenVerify = (secretId: number) => setVerifySecretId(secretId)
    const handleCloseVerify = () => setVerifySecretId(null)

    const handleDeleteSecret = async (secretId: number) => {
        try {
            await otpApi.deleteSecret(secretId)
            setTotpCodes(previous => previous.filter(item => item.secretId !== secretId))
            toast.success('Secreto eliminado correctamente')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al eliminar secreto')
        }
    }

    return (
        <div className='mx-auto w-full max-w-6xl px-4 py-6'>
            {/* ── header ── */}
            <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                        Autenticación TOTP
                    </h2>
                    <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                        Gestiona tus códigos de verificación en dos pasos
                    </p>
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                    <CreateAppModal onCreated={fetchTotpCodes} />
                    <GenerateSecretModal userId={userId} onGenerated={fetchTotpCodes} />
                    <AppRegistrationModal onRegistered={fetchTotpCodes} />
                </div>
            </div>

            {/* ── read error ── */}
            {loadError && (
                <div className='mb-4 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-red-900 dark:bg-red-950'>
                    <p className='text-sm text-red-800 dark:text-red-200'>{loadError}</p>
                    <button
                        type='button'
                        onClick={handleRetry}
                        className='cursor-pointer self-start rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 sm:self-auto dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900'
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {/* ── codes grid ── */}
            {isLoading ? (
                <div className='flex items-center justify-center py-20'>
                    <div className='h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent' />
                </div>
            ) : totpCodes.length === 0 ? (
                /* the empty state would misread as "no codes" during an outage */
                loadError ? null : (
                    <div className='rounded-xl border-2 border-dashed border-gray-300 py-16 text-center dark:border-gray-600'>
                        <ShieldLargeIcon />
                        <h3 className='mt-4 text-base font-semibold text-gray-900 dark:text-white'>
                            Sin códigos activos
                        </h3>
                        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                            Genera o importa un secreto para comenzar
                        </p>
                    </div>
                )
            ) : (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    {totpCodes.map(codeItem => (
                        <CodeCard
                            key={codeItem.secretId}
                            codeItem={codeItem}
                            onVerify={handleOpenVerify}
                            onDelete={handleDeleteSecret}
                        />
                    ))}
                </div>
            )}

            {/* ── verify modal ── */}
            {verifySecretId !== null && (
                <VerifyCodeModal secretId={verifySecretId} onClose={handleCloseVerify} />
            )}
        </div>
    )
}

/* ── empty-state icon ── */
function ShieldLargeIcon() {
    return (
        <svg
            className='mx-auto h-12 w-12 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={1.5}
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
            />
        </svg>
    )
}
