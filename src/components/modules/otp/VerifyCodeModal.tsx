'use client'
import { useState } from 'react'
import { otpApi } from '@/api/otp.api'
import { useToastContext } from '@/context/UI/ToastNotificationContext'

interface VerifyCodeModalProps {
    secretId: number
    onClose: () => void
}

export function VerifyCodeModal({ secretId, onClose }: VerifyCodeModalProps) {
    const { toast } = useToastContext()

    const [verificationToken, setVerificationToken] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [verificationResult, setVerificationResult] = useState<boolean | null>(null)

    const handleVerify = async () => {
        if (verificationToken.length !== 6) return

        setIsSubmitting(true)
        setVerificationResult(null)
        try {
            const { data } = await otpApi.verifyCode(secretId, verificationToken)
            setVerificationResult(data.valid)
            if (data.valid) {
                toast.success('Código verificado correctamente')
            } else {
                toast.error('Código inválido')
            }
        } catch {
            toast.error('Error al verificar código')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50'>
            <div className='relative mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800'>
                <div className='mb-5 flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                        Verificar Código
                    </h3>
                    <button
                        onClick={onClose}
                        className='rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
                    >
                        <CloseIcon />
                    </button>
                </div>

                <p className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
                    Ingresa el código de 6 dígitos para verificar.
                </p>

                <input
                    type='text'
                    maxLength={6}
                    inputMode='numeric'
                    placeholder='000000'
                    value={verificationToken}
                    onChange={e => setVerificationToken(e.target.value.replace(/\D/g, ''))}
                    className='mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-center font-mono text-2xl tracking-[.3em] shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    onKeyDown={e => {
                        if (e.key === 'Enter') handleVerify()
                    }}
                />

                {/* ── result feedback ── */}
                {verificationResult !== null && (
                    <div
                        className={`mb-4 rounded-lg px-3 py-2 text-center text-sm font-medium ${
                            verificationResult
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                    >
                        {verificationResult
                            ? 'Verificación exitosa'
                            : 'Código no válido — intenta de nuevo'}
                    </div>
                )}

                <div className='flex gap-2'>
                    <button
                        type='button'
                        onClick={onClose}
                        className='flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-700'
                    >
                        Cerrar
                    </button>
                    <button
                        type='button'
                        disabled={verificationToken.length !== 6 || isSubmitting}
                        onClick={handleVerify}
                        className='flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        {isSubmitting ? 'Verificando...' : 'Verificar'}
                    </button>
                </div>
            </div>
        </div>
    )
}

function CloseIcon() {
    return (
        <svg
            className='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
        >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
        </svg>
    )
}
