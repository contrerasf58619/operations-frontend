import axios from 'axios'
import { getHeaders } from '@/utils'

import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

export const uadApi = {

    getUADs(employeeId?: string) {
        const route = baseURL(api, 'uads/uads-by-roster', { employeeId: employeeId })
        return axios.get(route, { headers: getHeaders() })
    }
}