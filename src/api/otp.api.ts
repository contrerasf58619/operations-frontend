import axios from 'axios'
import { getHeaders } from '@/utils'
import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_WORKFORCE

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_WORKFORCE in your .env file')
}

export const otpApi = {
    /* ── Applications ── */

    getApp() {
        const route = baseURL(api, '2fa/apps')
        return axios.get(route, { headers: getHeaders() })
    },

    createApp(name: string) {
        const route = baseURL(api, '2fa/apps')
        return axios.post(route, { name }, { headers: getHeaders() })
    },

    updateApp(appId: number, name: string) {
        const route = baseURL(api, `2fa/apps/${appId}`)
        return axios.patch(route, { name }, { headers: getHeaders() })
    },

    activateApp(appId: number) {
        const route = baseURL(api, `2fa/apps/${appId}/activate`)
        return axios.patch(route, {}, { headers: getHeaders() })
    },

    deactivateApp(appId: number) {
        const route = baseURL(api, `2fa/apps/${appId}/deactivate`)
        return axios.patch(route, {}, { headers: getHeaders() })
    },

    /* ── Secrets ── */

    /** Flow A — generate an internal TOTP secret */
    generateSecret(userId: number, appId: number) {
        const route = baseURL(api, '2fa/generate')
        return axios.post(route, { userId, appId }, { headers: getHeaders() })
    },

    /** Flow B — register an external secret (import) */
    registerSecret(userId: number, appId: number, secret: string, email: string) {
        const route = baseURL(api, '2fa/register')
        return axios.post(route, { userId, appId, secret, email }, { headers: getHeaders() })
    },

    /* ── Codes ── */

    getCodes(userId: number) {
        const route = baseURL(api, '2fa/codes', { userId })
        return axios.get(route, { headers: getHeaders() })
    },

    deleteSecret(secretId: number) {
        const route = baseURL(api, `2fa/secrets/${secretId}`)
        return axios.delete(route, { headers: getHeaders() })
    },

    /* ── Verification ── */

    verifyCode(secretId: number, token: string) {
        const route = baseURL(api, '2fa/verify')
        return axios.post(route, { secretId, token }, { headers: getHeaders() })
    },
}
