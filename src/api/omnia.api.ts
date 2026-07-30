import axios from 'axios'
import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_OMNIA_ADMIN
const apiUadNest = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api || !apiUadNest) {
    throw new Error(
        'Please define NEXT_PUBLIC_URL_OMNIA_ADMIN or NEXT_PUBLIC_URL_UAD_NEST in your .env file',
    )
}

// ── Payloads ──────────────────────────────────────────────
export interface OmniaLoginPayload {
    username: string
    password: string
}
export interface OmniaReportePayload {
    reporte: string
    desde: string
    hasta: string
}
export interface OmniaReporteStatusPayload {
    id: number
}

// ── Responses ─────────────────────────────────────────────
export interface OmniaLoginResponse {
    token: string
    [key: string]: unknown
}
export interface OmniaReporteResponse {
    id: number
    [key: string]: unknown
}
export interface OmniaReporteStatusResponse {
    status: string
    data: string
    [key: string]: unknown
}
export interface OmniaReporteCsvResponse {
    [key: string]: unknown
}
export interface OmniaPostFilePayload {
    archivo: File | Blob
}
export interface OmniaPostFileResponse {
    [key: string]: unknown
}

// ── Helper ────────────────────────────────────────────────
const getBearerHeaders = (token: string) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
})

export const omniaApi = {
    login(payload: OmniaLoginPayload) {
        const route = baseURL(api, 'api/login/json')
        const params = new URLSearchParams()
        params.append('username', payload.username)
        params.append('password', payload.password)

        return axios.post<OmniaLoginResponse>(route, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
    },

    getReporte(payload: OmniaReportePayload, token: string) {
        const route = baseURL(api, 'api/get-reporte')
        return axios.get<OmniaReporteResponse>(route, {
            headers: getBearerHeaders(token),
            params: payload,
        })
    },

    getReporteStatus(payload: OmniaReporteStatusPayload, token: string) {
        const route = baseURL(api, 'api/get-reporte-status')
        return axios.get<OmniaReporteStatusResponse>(route, {
            headers: getBearerHeaders(token),
            params: payload,
        })
    },

    getCsvData(payload: { url: string; delimiter: string }) {
        const route = baseURL(apiUadNest, 'csv/data')
        return axios.post<any>(route, payload)
    },

    postFile(payload: OmniaPostFilePayload | File | Blob, token?: string) {
        const route = baseURL(api, 'api/post-file')
        const formData = new FormData()
        const file = payload instanceof Blob ? payload : payload.archivo
        formData.append('archivo', file)

        return axios.post<OmniaPostFileResponse>(route, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })
    },

    getDataByEmployeeCode(code: string) {
        const route = baseURL(apiUadNest, `rrhh/empleado/get-data-by-employee-code/${code}`)
        return axios.get<any>(route)
    },
}
