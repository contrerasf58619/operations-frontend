import useSWR from 'swr'
import { AxiosResponse } from 'axios'
import { alertsApi, PayrollBeforeDatePayload, OvertimePayload } from '@/api/alerts.api'
import {
    quincenasApi,
    QuincenaVariationParams,
    QuincenaVariationResponse,
} from '@/api/reports-api/quincenal.api'

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

/**
 * Las cuatro variaciones quincenales comparten payload, envoltura de respuesta y
 * manejo de error; lo unico que cambia es la key de cache y el metodo del api.
 *
 * A diferencia de `alertsApi`, que responde el arreglo directo, los endpoints de
 * `quincenas-ope` lo envuelven en `{ status, data }`, de ahi el `res.data.data`.
 *
 * `priorPayrollId` no se manda a proposito: el backend deriva la quincena anterior
 * a partir de `currentPayrollId`.
 */
const useQuincenaVariation = <TRow>(
    key: string,
    payload: OvertimePayload | null,
    fetcher: (
        params: QuincenaVariationParams,
    ) => Promise<AxiosResponse<QuincenaVariationResponse<TRow>>>,
) => {
    const { data, error, isLoading } = useSWR(
        payload && payload.uadId && payload.idPayroll
            ? [key, payload.uadId, payload.idPayroll]
            : null,
        async ([, uadId, idPayroll]) => {
            const res = await fetcher({
                uadId: uadId as number,
                currentPayrollId: idPayroll as number,
            })
            return res.data.data
        },
        {
            onError: err => console.error(`[quincenal] ${key}:`, err),
        },
    )

    return {
        alerts: data || [],
        loading: isLoading,
        error,
    }
}

export const useExtrasSimplesAlerts = (payload: OvertimePayload | null) =>
    useQuincenaVariation('extrasSimplesAlerts', payload, quincenasApi.getExtrasSimples)

export const useExtrasDDDAlerts = (payload: OvertimePayload | null) =>
    useQuincenaVariation('extrasDddAlerts', payload, quincenasApi.getExtrasDdd)

export const useExtrasWpAlerts = (payload: OvertimePayload | null) =>
    useQuincenaVariation('extrasWpAlerts', payload, quincenasApi.getExtrasWp)

export const useTotalExtrasSimplesAlerts = (payload: OvertimePayload | null) =>
    useQuincenaVariation('totalExtrasSimplesAlerts', payload, quincenasApi.getTotalExtrasSimples)
