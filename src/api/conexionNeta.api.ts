import axios from 'axios'
import { getHeaders } from '@/utils'

import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

export const conexionNetaApi = {
    getConexionNeta(startDate: string, endDate: string, uadId: number) {
        const route = baseURL(api, 'conexion-neta/gt',{startDate, endDate, uadId})
        return axios.get(route, { headers: getHeaders() })
    }
}