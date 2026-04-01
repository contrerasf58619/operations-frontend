import React from 'react'
import { usePayrollBeforeDates } from '@/hooks/useAlerts'

interface PayrollBeforeDatesSelectorProps {
  uadId: number
  date: number
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export const PayrollBeforeDatesSelector: React.FC<PayrollBeforeDatesSelectorProps> = ({
  uadId,
  date,
  value,
  onChange,
  disabled
}) => {
  const { payrolls, loading } = usePayrollBeforeDates(
    uadId && date ? { uadId, date } : null
  )

  return (
    <select
      name="payroll"
      id="payroll"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled || loading || !uadId}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors disabled:bg-gray-100 disabled:text-gray-500"
    >
      <option value="">
        {loading ? 'Cargando nóminas...' : 'Seleccionar nómina...'}
      </option>
      {payrolls.map((period) => (
        <option key={period.id_payroll} value={period.id_payroll}>
          {period.description}: {period.date_from.split('T')[0]} to {period.date_to.split('T')[0]}
        </option>
      ))}
    </select>
  )
}
