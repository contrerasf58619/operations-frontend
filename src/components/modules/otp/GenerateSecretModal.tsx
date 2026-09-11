'use client'
import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { otpApi } from '@/api/otp.api'
import { useToastContext } from '@/context/UI/ToastNotificationContext'
import type { TwoFactorApp, GenerateSecretResponse } from '@/interfaces/otp.interface'

interface GenerateSecretModalProps {
    userId: number
    onGenerated: () => void
}

type ModalStep = 'select-app' | 'show-secret' | 'verify'

export function GenerateSecretModal({ userId, onGenerated }: GenerateSecretModalProps) {
    const { toast } = useToastContext()

    const [isOpen, setIsOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState<ModalStep>('select-app')
    const [isSubmitting, setIsSubmitting] = useState(false)

    /* ── step 1: app selection ── */
    const [availableApps, setAvailableApps] = useState<TwoFactorApp[]>([])
    const [selectedAppId, setSelectedAppId] = useState<number | null>(null)

    /* ── step 2: generated secret ── */
    const [generatedSecret, setGeneratedSecret] = useState<GenerateSecretResponse | null>(null)
    const [hasCopiedSecret, setHasCopiedSecret] = useState(false)

    /* ── step 3: verification ── */
    const [verificationToken, setVerificationToken] = useState('')

    useEffect(() => {
        if (!isOpen) return
        const loadApps = async () => {
            try {
                const { data } = await otpApi.getApp()
                setAvailableApps(data)
            } catch {
                toast.error('Error al cargar aplicaciones')
            }
        }
        loadApps()
    }, [isOpen, toast])

    const resetModal = () => {
        setCurrentStep('select-app')
        setSelectedAppId(null)
        setGeneratedSecret(null)
        setVerificationToken('')
        setHasCopiedSecret(false)
        setIsSubmitting(false)
    }

    const handleOpen = () => {
        resetModal()
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
        resetModal()
    }

    /* ── step 1 → 2: generate secret ── */
    const handleGenerateSecret = async () => {
        if (!selectedAppId) return
        setIsSubmitting(true)
        try {
            const { data } = await otpApi.generateSecret(userId, selectedAppId)
            setGeneratedSecret(data)
            setCurrentStep('show-secret')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al generar secreto')
        } finally {
            setIsSubmitting(false)
        }
    }

    /* ── step 2 → 3: proceed to verify ── */
    const handleProceedToVerify = () => setCurrentStep('verify')

    /* ── step 3: verify the code ── */
    const handleVerifySetup = async () => {
        if (!generatedSecret || verificationToken.length !== 6) return
        setIsSubmitting(true)
        try {
            const { data } = await otpApi.verifyCode(generatedSecret.secretId, verificationToken)
            if (data.valid) {
                toast.success('Verificación exitosa — secreto configurado correctamente')
                onGenerated()
                handleClose()
            } else {
                toast.error('Código inválido. Intenta de nuevo.')
            }
        } catch {
            toast.error('Error al verificar código')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCopySecret = async () => {
        if (!generatedSecret) return
        await navigator.clipboard.writeText(generatedSecret.secret)
        setHasCopiedSecret(true)
        setTimeout(() => setHasCopiedSecret(false), 1500)
    }

    const selectedAppName = availableApps.find(app => app.id === selectedAppId)?.name

    return (
        <>
            <button
                type='button'
                onClick={handleOpen}
                className='inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700'
            >
                <PlusKeyIcon />
                Generar Secreto
            </button>

            {isOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50'>
                    <div className='relative mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800'>
                        {/* ── modal header ── */}
                        <div className='mb-5 flex items-center justify-between'>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                    {currentStep === 'select-app' && 'Generar Secreto TOTP'}
                                    {currentStep === 'show-secret' && 'Escanea el Código QR'}
                                    {currentStep === 'verify' && 'Verificar Configuración'}
                                </h3>
                                <StepIndicator currentStep={currentStep} />
                            </div>
                            <button
                                onClick={handleClose}
                                className='rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* ── step 1: select app ── */}
                        {currentStep === 'select-app' && (
                            <div>
                                {/* heads a group of buttons, not a form control */}
                                <p className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                                    Selecciona una aplicación
                                </p>
                                <div className='mb-5 grid grid-cols-2 gap-2'>
                                    {availableApps.map(app => (
                                        <button
                                            key={app.id}
                                            type='button'
                                            onClick={() => setSelectedAppId(app.id)}
                                            className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                                                selectedAppId === app.id
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-900/30 dark:text-indigo-300'
                                                    : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                                            }`}
                                        >
                                            {app.name}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type='button'
                                    disabled={!selectedAppId || isSubmitting}
                                    onClick={handleGenerateSecret}
                                    className='w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
                                >
                                    {isSubmitting ? 'Generando...' : 'Generar'}
                                </button>
                            </div>
                        )}

                        {/* ── step 2: show QR + secret ── */}
                        {currentStep === 'show-secret' && generatedSecret && (
                            <div className='text-center'>
                                <div className='mx-auto mb-4 inline-flex rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-white'>
                                    <QRCodeSVG
                                        value={generatedSecret.otpauthUrl}
                                        size={180}
                                        level='M'
                                    />
                                </div>

                                <p className='mb-2 text-sm text-gray-600 dark:text-gray-400'>
                                    Escanea con tu app autenticadora o copia la clave manual:
                                </p>

                                <div className='mb-4 flex items-center justify-center gap-2'>
                                    <code className='rounded-lg bg-gray-100 px-3 py-2 font-mono text-xs tracking-wide text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
                                        {generatedSecret.secret}
                                    </code>
                                    <button
                                        type='button'
                                        onClick={handleCopySecret}
                                        className='rounded-lg border border-gray-300 p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-500 dark:text-gray-400 dark:hover:bg-gray-700'
                                        title='Copiar clave'
                                    >
                                        {hasCopiedSecret ? <CheckSmallIcon /> : <CopySmallIcon />}
                                    </button>
                                </div>

                                {selectedAppName && (
                                    <p className='mb-4 text-xs text-gray-500 dark:text-gray-400'>
                                        Aplicación: <strong>{selectedAppName}</strong>
                                    </p>
                                )}

                                <button
                                    type='button'
                                    onClick={handleProceedToVerify}
                                    className='w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700'
                                >
                                    Ya escaneé — Verificar
                                </button>
                            </div>
                        )}

                        {/* ── step 3: verify ── */}
                        {currentStep === 'verify' && (
                            <div>
                                <p className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
                                    Ingresa el código de 6 dígitos que muestra tu app autenticadora
                                    para confirmar la configuración.
                                </p>
                                <input
                                    type='text'
                                    maxLength={6}
                                    inputMode='numeric'
                                    placeholder='000000'
                                    value={verificationToken}
                                    onChange={e =>
                                        setVerificationToken(e.target.value.replace(/\D/g, ''))
                                    }
                                    className='mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-center font-mono text-2xl tracking-[.3em] shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                                />
                                <button
                                    type='button'
                                    disabled={verificationToken.length !== 6 || isSubmitting}
                                    onClick={handleVerifySetup}
                                    className='w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
                                >
                                    {isSubmitting ? 'Verificando...' : 'Verificar Código'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

/* ── step indicator ── */
function StepIndicator({ currentStep }: { currentStep: ModalStep }) {
    const steps: { key: ModalStep; label: string }[] = [
        { key: 'select-app', label: 'App' },
        { key: 'show-secret', label: 'QR' },
        { key: 'verify', label: 'Verificar' },
    ]

    const currentIndex = steps.findIndex(s => s.key === currentStep)

    return (
        <div className='mt-2 flex items-center gap-1'>
            {steps.map((step, stepIndex) => (
                <div key={step.key} className='flex items-center gap-1'>
                    <span
                        className={`inline-block h-1.5 w-6 rounded-full transition-colors ${
                            stepIndex <= currentIndex
                                ? 'bg-indigo-600'
                                : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    />
                </div>
            ))}
        </div>
    )
}

/* ── icons ── */

function PlusKeyIcon() {
    return (
        <svg
            className='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25z'
            />
        </svg>
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

function CopySmallIcon() {
    return (
        <svg
            className='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
        >
            <rect x='9' y='9' width='13' height='13' rx='2' />
            <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
        </svg>
    )
}

function CheckSmallIcon() {
    return (
        <svg
            className='h-4 w-4 text-emerald-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
        >
            <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
        </svg>
    )
}
