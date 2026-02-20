import axios from 'axios'
import { getHeaders } from '@/utils'
import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_ATS + 'catalog-rrhh/'

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_CATALOG_RRHH in your .env file')
}

export const catalogshrApi = {
    getUnit(payload = {}) {
        const route = baseURL(api, 'unit')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getJobPosition(payload = {}) {
        const route = baseURL(api, 'job-position')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getCostCenter(payload = {}) {
        const route = baseURL(api, 'cost-center')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getSite(payload = {}) {
        const route = baseURL(api, 'site')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getPayroll(payload = {}) {
        const route = baseURL(api, 'payroll-group')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getDepartment(payload = {}) {
        const route = baseURL(api, 'department')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getTownship(payload = {}) {
        const route = baseURL(api, 'township')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getCountry(payload = {}) {
        const route = baseURL(api, 'country')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getProfession(payload = {}) {
        const route = baseURL(api, 'profession')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getProfessions(payload = {}) {
        const route = baseURL(api, 'professions')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getLoginName(payload = {}) {
        const route = baseURL(api, 'loginname')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getLastIdProfession(payload = {}) {
        const route = baseURL(api, 'last-id-profession')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    saveNewProfession(payload: any) {
        const route = baseURL(api, 'new-profession')
        return axios.post(route, payload, { headers: getHeaders() })
    },
    getClients(payload = {}) {
        const route = baseURL(api, 'client')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
    getCostCenterByClient(payload = {}) {
        const route = baseURL(api, 'cost-center-by-client')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },
}
