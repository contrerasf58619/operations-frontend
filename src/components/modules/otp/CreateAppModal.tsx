'use client'
import { useState } from 'react'
import { otpApi } from '@/api/otp.api'
import { useToastContext } from '@/context/UI/ToastNotificationContext'

interface CreateAppModalProps {
    onCreated?: () => void
}

export function CreateAppModal({ onCreated }: CreateAppModalProps) {
    const { toast } = useToastContext()

    const [isOpen, setIsOpen] = useState(false)
    const [applicationName, setApplicationName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleClose = () => {
        setIsOpen(false)
        setApplicationName('')
    }

    const handleCreateApp = async () => {
        const trimmedName = applicationName.trim()
        if (!trimmedName) return

        setIsSubmitting(true)
        try {
            await otpApi.createApp(trimmedName)
            toast.success(`Aplicación "${trimmedName}" creada exitosamente`)
            onCreated?.()
            handleClose()
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al crear aplicación'
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <button
                type='button'
                onClick={() => setIsOpen(true)}
                className='inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            >
                <PlusIcon />
                Nueva App
            </button>

            {isOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50'>
                    <div className='relative mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800'>
                        <div className='mb-5 flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                Crear Aplicación
                            </h3>
                            <button
                                onClick={handleClose}
                                className='rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <label
                            htmlFor='otp-application-name'
                            className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
                        >
                            Nombre de la aplicación
                        </label>
                        <input
                            id='otp-application-name'
                            type='text'
                            value={applicationName}
                            onChange={e => setApplicationName(e.target.value)}
                            placeholder='Ej: Microsoft 365, GitHub...'
                            maxLength={255}
                            className='mb-4 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleCreateApp()
                            }}
                        />

                        <button
                            type='button'
                            disabled={!applicationName.trim() || isSubmitting}
                            onClick={handleCreateApp}
                            className='w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            {isSubmitting ? 'Creando...' : 'Crear Aplicación'}
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

/* ── icons ── */

function PlusIcon() {
    return (
        <svg
            className='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
        >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
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
