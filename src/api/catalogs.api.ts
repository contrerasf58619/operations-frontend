import axios from 'axios'
import { getHeaders } from '@/utils'

import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_CATALOG_CORE
const appId = process.env.NEXT_PUBLIC_APP_ID

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_AWS_OPERATION in your .env file')
}

export const catalogsApi = {
    getCatalogs() {
        const route = baseURL(api, 'catalogs/all')
        return axios.get(route, { headers: getHeaders() })
    },
    getPrivelege() {
        const route = baseURL(api, 'permission/app')
        return axios.get(route, { headers: getHeaders() })
    },
    routeRelative() {
        const route = baseURL(api, 'menu/routeRelative')
        return axios.get(route, { headers: getHeaders() })
    },
    getMenus(employeeCode?: string) {
        const route = baseURL(api, 'menu/privileges', { appId, employeeCode })
        return axios.get(route, { headers: getHeaders() })
    },
    getAllMenus() {
        const route = baseURL(api, 'menu/getMenus', { appId })
        return axios.get(route, { headers: getHeaders() })
    },
    getAllApps() {
        const route = baseURL(api, 'app/all')
        return axios.get(route, { headers: getHeaders() })
    },
}
