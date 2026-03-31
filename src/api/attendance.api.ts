import axios from 'axios'
import { getHeaders } from '@/utils'
import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

export interface AttendancePayload {
    uadId: string
    responsable: string | undefined
    attendances: {
        agent_roster: number
        name: string
        fechas: {
            attendance_type: string | null
            fecha: string
            weekend: boolean
        }[]
    }[]
}

export interface PayrollPeriod {
    date_from: string
    date_to: string
}

export const attendanceApi = {
    getLeaders(payload = {}) {
        const route = baseURL(api, 'attendances/get-leaders')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getUsersByLeader(payload = {}) {
        const route = baseURL(api, `attendances/get-team-by-supervisor`)
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getPayrollNextDates(payload = {}) {
        const route = baseURL(api, 'attendances/get-payroll-next-dates')
        return axios.get<PayrollPeriod[]>(route, { headers: getHeaders(), params: payload })
    },

    getAttendanceTypes(payload = {}) {
        const route = baseURL(api, 'attendances/get-attendance-types')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },

    getAttendancesByDateRangeAndSupervisor(payload = {}) {
        const route = baseURL(api, 'attendances/get-attendances-by-date-range-and-supervisor')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },

    saveAttendance(data: AttendancePayload) {
        const route = baseURL(api, 'attendances/save-attendances')
        return axios.post(route, data, { headers: getHeaders() })
    },
}
