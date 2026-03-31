import axios from 'axios'
import { getHeaders } from '@/utils'
import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_ATS

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_GENERATION in your .env file')
}

export const generationApi = {
    getGenerations(payload = {}) {
        const route = baseURL(api, 'generation')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },

    createGenerations(payload: any) {
        const route = baseURL(api, 'generation')
        return axios.post(route, payload, { headers: getHeaders() })
    },

    updateGenerations(payload: any, id: number) {
        const route = baseURL(api, `generation/${id}`)
        return axios.put(route, payload, { headers: getHeaders() })
    },

    generationNumberByPayrollGroup(payload = {}) {
        const route = baseURL(api, 'generation/generation-number-by-payroll-group')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },

    approveByName(payload = {}) {
        const route = baseURL(api, 'generation/approver-name')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },

    updateWorkForceGeneration(payload: any, id: number) {
        const route = baseURL(api, `generation/workforce-data/${id}`)
        return axios.put(route, payload, { headers: getHeaders() })
    },

    updateRecruitmentGeneration(payload: any, id: number) {
        const route = baseURL(api, `generation/recruitment-data/${id}`)
        return axios.patch(route, payload, { headers: getHeaders() })
    },

    changeStatus(payload: any, id: number) {
        const route = baseURL(api, `generation/status/${id}`)
        return axios.patch(route, payload, { headers: getHeaders() })
    },

    // Generation Shift endpoints
    getGenerationShift(payload = {}) {
        const route = baseURL(api, 'generation-shift')
        return axios.get(route, { headers: getHeaders(), params: payload })
    },

    createGenerationShift(payload: any) {
        const route = baseURL(api, 'generation-shift')
        return axios.post(route, payload, { headers: getHeaders() })
    },

    updateGenerationShift(payload: any, id: number) {
        const route = baseURL(api, `generation-shift/${id}`)
        return axios.put(route, payload, { headers: getHeaders() })
    },

    deleteGenerationShift(payload: any) {
        const route = baseURL(api, 'generation-shift')
        return axios.delete(route, { headers: getHeaders(), data: payload })
    },
}
