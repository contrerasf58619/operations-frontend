import axios from 'axios'
import { getHeaders } from '@/utils'
import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

export const uadApi = {
    async getAllUADs() {
        try {
            const route = baseURL(api, 'uads')
            return await axios.get(route, {
                headers: getHeaders(),
            })
        } catch {
            throw new Error('Error fetching UADs')
        }
    },

    async getUADByEmployeeCode(employeeCode: number, allUads = false) {
        try {
            const route = baseURL(api, 'uads/by-id', {
                employeeId: employeeCode,
                allUads: allUads ? 'true' : 'false',
            })
            return axios.get(route, {
                headers: getHeaders(),
            })
        } catch {
            throw new Error('Error fetching UADs')
        }
    },
}
