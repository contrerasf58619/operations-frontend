'use client'
import { useState } from 'react'
import type { TotpCodeItem } from '@/interfaces/otp.interface'

const TOTP_PERIOD = 30

interface CodeCardProps {
    codeItem: TotpCodeItem
    onVerify?: (secretId: number) => void
    onDelete?: (secretId: number) => void
}

export function CodeCard({ codeItem, onVerify, onDelete }: CodeCardProps) {
    const { secretId, appName, email, code, remainingTime } = codeItem
    const [hasCopied, setHasCopied] = useState(false)
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

    const isExpiringSoon = remainingTime <= 5
    const countdownFraction = remainingTime / TOTP_PERIOD

    /* ── circular timer SVG values ── */
    const circleRadius = 18
    const circleCircumference = 2 * Math.PI * circleRadius
    const circleOffset = circleCircumference * (1 - countdownFraction)

    const timerStrokeColor = isExpiringSoon
        ? 'stroke-red-500'
        : remainingTime <= 10
          ? 'stroke-amber-400'
          : 'stroke-emerald-500'

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(code)
        setHasCopied(true)
        setTimeout(() => setHasCopied(false), 1500)
    }

    const formattedCode = `${code.slice(0, 3)} ${code.slice(3)}`

    return (
        <div className='group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-600 dark:bg-gray-800'>
            {/* ── header ── */}
            <div className='mb-4 flex items-start justify-between'>
                <div className='min-w-0 flex-1'>
                    <h4 className='truncate text-sm font-semibold text-gray-900 dark:text-white'>
                        {appName}
                    </h4>
                    {email && (
                        <p className='mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400'>
                            {email}
                        </p>
                    )}
                </div>

                {/* ── circular countdown ── */}
                <div className='relative ml-3 flex-shrink-0'>
                    <svg width='44' height='44' className='-rotate-90'>
                        <circle
                            cx='22'
                            cy='22'
                            r={circleRadius}
                            fill='none'
                            strokeWidth='3'
                            className='stroke-gray-200 dark:stroke-gray-600'
                        />
                        <circle
                            cx='22'
                            cy='22'
                            r={circleRadius}
                            fill='none'
                            strokeWidth='3'
                            strokeLinecap='round'
                            strokeDasharray={circleCircumference}
                            strokeDashoffset={circleOffset}
                            className={`${timerStrokeColor} transition-[stroke-dashoffset] duration-1000 ease-linear`}
                        />
                    </svg>
                    <span className='absolute inset-0 flex items-center justify-center text-[11px] font-bold text-gray-700 dark:text-gray-300'>
                        {remainingTime}
                    </span>
                </div>
            </div>

            {/* ── code display ── */}
            <div
                className={`mb-3 rounded-lg px-4 py-3 text-center font-mono text-2xl font-bold tracking-[.25em] transition-colors ${
                    isExpiringSoon
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white'
                }`}
            >
                {formattedCode}
            </div>

            {/* ── actions ── */}
            {isConfirmingDelete ? (
                <div className='flex items-center gap-2'>
                    <span className='flex-1 text-xs text-red-600 dark:text-red-400'>
                        ¿Eliminar este secreto?
                    </span>
                    <button
                        type='button'
                        onClick={() => {
                            onDelete?.(secretId)
                            setIsConfirmingDelete(false)
                        }}
                        className='rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700'
                    >
                        Sí
                    </button>
                    <button
                        type='button'
                        onClick={() => setIsConfirmingDelete(false)}
                        className='rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-700'
                    >
                        No
                    </button>
                </div>
            ) : (
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={handleCopyCode}
                        className='flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-700'
                    >
                        {hasCopied ? (
                            <>
                                <CheckIcon />
                                Copiado
                            </>
                        ) : (
                            <>
                                <CopyIcon />
                                Copiar
                            </>
                        )}
                    </button>

                    {onVerify && (
                        <button
                            type='button'
                            onClick={() => onVerify(secretId)}
                            className='flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700'
                        >
                            <ShieldIcon />
                            Verificar
                        </button>
                    )}

                    {onDelete && (
                        <button
                            type='button'
                            onClick={() => setIsConfirmingDelete(true)}
                            className='flex items-center justify-center rounded-lg border border-red-300 p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-900/20'
                            title='Eliminar secreto'
                        >
                            <TrashIcon />
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

/* ── inline SVG icons ── */

function CopyIcon() {
    return (
        <svg
            className='h-3.5 w-3.5'
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

function CheckIcon() {
    return (
        <svg
            className='h-3.5 w-3.5 text-emerald-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
        >
            <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
        </svg>
    )
}

function ShieldIcon() {
    return (
        <svg
            className='h-3.5 w-3.5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
            />
        </svg>
    )
}

function TrashIcon() {
    return (
        <svg
            className='h-3.5 w-3.5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
            />
        </svg>
    )
}
