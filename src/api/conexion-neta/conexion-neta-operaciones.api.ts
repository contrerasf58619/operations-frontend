import axios from 'axios'
import { getHeaders } from '@/utils'
import { baseURL } from '../baseURL'
import { ConexionNetaOpeRow } from '@/components/reports/operaciones/interfaces/ConexionNetaOpeRow.interface'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

export interface ConexionNetaOpeParams extends Record<string, string | number | undefined> {
    startDate: string
    endDate: string
    uadId: number
}

export const conexionNetaOperacionesApi = {
    getConexionNeta(params: ConexionNetaOpeParams) {
        const route = baseURL(api, 'conexion-neta-operaciones', params)
        return axios.get<{ status: number; data: ConexionNetaOpeRow[] }>(route, {
            headers: getHeaders(),
        })
    },
    getConexionNetaOpeGT(params: ConexionNetaOpeParams) {
        const route = baseURL(api, 'conexion-neta-operaciones/gt', params)
        return axios.get<{ status: number; data: ConexionNetaOpeRow[] }>(route, {
            headers: getHeaders(),
        })
    },
}
