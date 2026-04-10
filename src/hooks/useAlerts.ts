import useSWR from 'swr'
import { alertsApi, PayrollBeforeDatePayload, OvertimePayload } from '@/api/alerts.api'

export const usePayrollBeforeDates = (payload: PayrollBeforeDatePayload | null) => {
    const { data, error, isLoading } = useSWR(
        payload && payload.uadId && payload.date
            ? ['payrollBeforeDates', payload.uadId, payload.date]
            : null,
        async ([, uadId, date]) => {
            const res = await alertsApi.getPayrollBeforeDates({
                uadId: uadId as number,
                date: date as number,
            })
            return res.data
        },
    )

    return {
        payrolls: data || [],
        loading: isLoading,
        error,
    }
}

export const useOvertimeAlerts = (payload: OvertimePayload | null) => {
    const { data, error, isLoading } = useSWR(
        payload && payload.uadId && payload.idPayroll
            ? ['overtimeAlerts', payload.uadId, payload.idPayroll]
            : null,
        async ([, uadId, idPayroll]) => {
            const res = await alertsApi.getOvertime({
                uadId: uadId as number,
                idPayroll: idPayroll as number,
            })
            return res.data
        },
    )

    return {
        alerts: data || [],
        loading: isLoading,
        error,
    }
}

export const useHoursOnTheWorkday = (payload: OvertimePayload | null) => {
    const { data, error, isLoading } = useSWR(
        payload && payload.uadId && payload.idPayroll
            ? ['hoursOnTheWorkday', payload.uadId, payload.idPayroll]
            : null,
        async ([, uadId, idPayroll]) => {
            const res = await alertsApi.getHoursOnTheWorkday({
                uadId: uadId as number,
                idPayroll: idPayroll as number,
            })
            return res.data
        },
    )

    return {
        alerts: data || [],
        loading: isLoading,
        error,
    }
}

export const useHoursOnVacation = (payload: OvertimePayload | null) => {
    const { data, error, isLoading } = useSWR(
        payload && payload.uadId && payload.idPayroll
            ? ['hoursOnVacation', payload.uadId, payload.idPayroll]
            : null,
        async ([, uadId, idPayroll]) => {
            const res = await alertsApi.getHoursOnVacation({
                uadId: uadId as number,
                idPayroll: idPayroll as number,
            })
            return res.data
        },
    )

    return {
        alerts: data || [],
        loading: isLoading,
        error,
    }
}
