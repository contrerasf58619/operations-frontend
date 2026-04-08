import axios from 'axios'
import { getHeaders } from '@/utils'
import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

export interface PayrollBeforeDatePayload {
    uadId: number
    date: number
}

export interface PayrollBeforeDateResponse {
    id_payroll: string
    description: string
    date_from: string
    date_to: string
}

export interface OvertimePayload {
    uadId: number
    idPayroll: number
}

export interface OvertimeAlertResponse {
    roster_id: number
    semana: string
    extras: string
    tiempo_productivo: string
    porcentaje: number
}

export const alertsApi = {
    getPayrollBeforeDates(payload: PayrollBeforeDatePayload) {
        const route = baseURL(api, 'alerts/payroll-before-dates')
        return axios.get<PayrollBeforeDateResponse[]>(route, {
            headers: getHeaders(),
            params: payload,
        })
    },

    getOvertime(payload: OvertimePayload) {
        const route = baseURL(api, 'alerts/overtime')
        return axios.get<OvertimeAlertResponse[]>(route, { headers: getHeaders(), params: payload })
    },
}
