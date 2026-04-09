import React from 'react'
import dayjs from 'dayjs'
require('dayjs/locale/es')

export interface PayrollPeriod {
    date_from: string
    date_to: string
}

interface PayrollPeriodSelectorProps {
    payrollPeriods: PayrollPeriod[]
    selectedPayrollPeriod: PayrollPeriod | null
    onChange: (period: PayrollPeriod) => void
    loading?: boolean
    disabled?: boolean
    errorText?: string | React.ReactNode
    id?: string
}

export const PayrollPeriodSelector: React.FC<PayrollPeriodSelectorProps> = ({
    payrollPeriods,
    selectedPayrollPeriod,
    onChange,
    loading = false,
    disabled = false,
    errorText,
    id,
}) => {
    return (
        <div className='space-y-4'>
            <select
                id={id}
                value={
                    selectedPayrollPeriod
                        ? `${dayjs(selectedPayrollPeriod.date_from).utc().format('YYYY-MM-DD')} a ${dayjs(selectedPayrollPeriod.date_to).utc().format('YYYY-MM-DD')}`
                        : ''
                }
                onChange={e => {
                    const [start, end] = e.target.value.split('a')
                    if (start && end) {
                        onChange({ date_from: start.trim(), date_to: end.trim() })
                    }
                }}
                className='w-full p-2 border rounded disabled:bg-gray-100 disabled:text-gray-500'
                disabled={disabled || loading || payrollPeriods.length === 0}
            >
                {payrollPeriods.map(p => (
                    <option
                        key={`${p.date_from}-${p.date_to}`}
                        value={`${dayjs(p.date_from).utc().format('YYYY-MM-DD')} a ${dayjs(p.date_to).utc().format('YYYY-MM-DD')}`}
                    >
                        {dayjs(p.date_from).utc().locale('es').format('D [de] MMMM [de] YYYY')} -{' '}
                        {dayjs(p.date_to).utc().locale('es').format('D [de] MMMM [de] YYYY')}
                    </option>
                ))}
            </select>
            {loading && <div className='text-xs text-gray-500 mt-1'>Cargando...</div>}
            {!loading && payrollPeriods.length === 0 && errorText && (
                <div className='text-xs text-red-500 mt-1'>{errorText}</div>
            )}
        </div>
    )
}
