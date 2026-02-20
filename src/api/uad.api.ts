import axios from 'axios'
import { getHeaders } from '@/utils'

import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

export const uadApi = {
    getUADs() {
        const route = baseURL(api, 'uads/uads-by-roster',{employeeId: 58619})
        return axios.get(route, { headers: getHeaders() })
    }
}