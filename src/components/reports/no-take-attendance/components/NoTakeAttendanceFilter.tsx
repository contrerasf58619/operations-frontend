import { UadList } from '@/components/catalogs/UadList'
import { PayrollPeriodSelector } from '@/components/UI/PayrollPeriodSelector'
import { useNoTakeAttendanceContext } from '../context/useNoTakeAttendanceContext'

export const NoTakeAttendanceFilter = () => {
    const {
        selectedUad,
        handleUadChange,
        payrollPeriods,
        selectedPayrollPeriod,
        setSelectedPayrollPeriod,
        setStartDate,
        setEndDate,
        loadingPayroll,
    } = useNoTakeAttendanceContext()

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                <label htmlFor='uad' className='block text-sm font-semibold text-gray-900 mb-4'>
                    UAD
                </label>
                <div className='space-y-4 mt-2'>
                    <UadList value={selectedUad} onChange={handleUadChange} />
                </div>
            </div>

            <div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                <label htmlFor='payroll' className='block text-sm font-semibold text-gray-900 mb-4'>
                    Periodo de nómina
                </label>
                <PayrollPeriodSelector
                    id='payroll'
                    payrollPeriods={payrollPeriods}
                    selectedPayrollPeriod={selectedPayrollPeriod}
                    onChange={period => {
                        setStartDate(period.date_from)
                        setEndDate(period.date_to)
                        setSelectedPayrollPeriod(period)
                    }}
                    loading={loadingPayroll}
                    disabled={!selectedUad}
                />
            </div>
        </div>
    )
}
