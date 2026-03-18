import React from 'react'
import dayjs from 'dayjs'

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
}

export const PayrollPeriodSelector: React.FC<PayrollPeriodSelectorProps> = ({
  payrollPeriods,
  selectedPayrollPeriod,
  onChange,
  loading = false,
  disabled = false,
  errorText,
}) => {
  return (
    <div className="space-y-4">
      <select
        value={
          selectedPayrollPeriod
            ? `${dayjs(selectedPayrollPeriod.date_from).format('YYYY-MM-DD')} a ${dayjs(selectedPayrollPeriod.date_to).format('YYYY-MM-DD')}`
            : ''
        }
        onChange={(e) => {
          const [start, end] = e.target.value.split('a')
          if (start && end) {
            onChange({ date_from: start.trim(), date_to: end.trim() })
          }
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        disabled={disabled || loading || payrollPeriods.length === 0}
      >
        {payrollPeriods.map((p) => (
          <option
            key={`${p.date_from}-${p.date_to}`}
            value={`${dayjs(p.date_from).format('YYYY-MM-DD')} a ${dayjs(p.date_to).format('YYYY-MM-DD')}`}
          >
            {dayjs(p.date_from).format('YYYY-MM-DD')} - {dayjs(p.date_to).format('YYYY-MM-DD')}
          </option>
        ))}
      </select>
      {loading && (
        <div className="text-xs text-gray-500 mt-1">Cargando...</div>
      )}
      {!loading && payrollPeriods.length === 0 && errorText && (
        <div className="text-xs text-red-500 mt-1">
          {errorText}
        </div>
      )}
    </div>
  )
}
