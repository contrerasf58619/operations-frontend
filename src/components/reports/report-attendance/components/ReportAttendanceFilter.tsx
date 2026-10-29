import { UadList } from '@/components/catalogs/UadList'
import { Autocomplete } from '@/components/UI/Autocomplete'
import { PayrollPeriodSelector } from '@/components/UI/PayrollPeriodSelector'
import { useReportAttendanceContext } from '../context/useReportAttendanceContext'

export const ReportAttendanceFilter = () => {
    const {
        selectedUad,
        setSelectedUad,
        payrollPeriods,
        selectedPayrollPeriod,
        setSelectedPayrollPeriod,
        setStartDate,
        setEndDate,
        loadingPayroll,
        leaders,
        selectedLeader,
        setSelectedLeader,
        loadingLeaders,
        handleSearchReports,
    } = useReportAttendanceContext()

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            {/* UAD */}
            <div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                <label htmlFor='uad' className='block text-sm font-semibold text-gray-900 mb-4'>
                    UAD
                </label>
                <div className='space-y-4 mt-2'>
                    <UadList value={selectedUad} onChange={v => setSelectedUad(v)} />
                </div>
            </div>

            {/* Periodo de nómina */}
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

            {/* Seleccionar líder */}
            <div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                <label htmlFor='leader' className='block text-sm font-semibold text-gray-900 mb-4'>
                    Seleccionar líder
                </label>
                <div className='space-y-2'>
                    <Autocomplete
                        id='leader'
                        value={selectedLeader}
                        onChange={val => {
                            const leader = val as string
                            setSelectedLeader(leader)
                            handleSearchReports(leader)
                        }}
                        options={leaders.map(leader => ({
                            value: leader.sup_code,
                            label: leader.name,
                        }))}
                        placeholder='Buscar líder...'
                        disabled={!selectedUad || loadingLeaders || leaders.length === 0}
                        noOptionsText='No se encontraron líderes'
                    />
                </div>
            </div>
        </div>
    )
}
