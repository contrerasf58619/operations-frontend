import { useState, useEffect } from 'react'
import { attendanceApi } from '@/api'
import { toast } from 'react-toastify'

interface PayrollPeriod {
    date_from: string
    date_to: string
}

export const usePayrollPeriods = (selectedUad: string, employeeCode: string | undefined) => {
    const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>([])
    const [selectedPayrollPeriod, setSelectedPayrollPeriod] = useState<PayrollPeriod | null>(null)
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [loadingPayroll, setLoadingPayroll] = useState(false)

    useEffect(() => {
        if (!selectedUad || !employeeCode) {
            setPayrollPeriods([])
            setSelectedPayrollPeriod(null)
            setStartDate('')
            setEndDate('')
            return
        }

        setLoadingPayroll(true)
        attendanceApi
            .getPayrollNextDates({ uadId: selectedUad, rosterId: employeeCode })
            .then(res => {
                const data = res.data || []
                setPayrollPeriods(data)
                if (data.length > 0) {
                    setSelectedPayrollPeriod({
                        date_from: data[0]?.date_from,
                        date_to: data[0]?.date_to,
                    })
                    setStartDate(data[0]?.date_from)
                    setEndDate(data[0]?.date_to)
                }
            })
            .catch(err => {
                console.error('Error fetching payroll periods', err)
                toast.error('Error al cargar los periodos de nómina')
            })
            .finally(() => setLoadingPayroll(false))
    }, [selectedUad, employeeCode])

    return {
        payrollPeriods,
        selectedPayrollPeriod,
        setSelectedPayrollPeriod,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        loadingPayroll,
    }
}
