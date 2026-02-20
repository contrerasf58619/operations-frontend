import axios from 'axios'
import { getHeaders } from '@/utils/'
import { baseURL } from './baseURL'
import {
    ChangePasswordPayload,
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
} from '@/interfaces/auth.interface'

const api = process.env.NEXT_PUBLIC_URL_AWS_OPERATION

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_AWS_OPERATION in your .env file')
}

export const awsOperationApi = {
    login(payload: LoginPayload) {
        const route = baseURL(api, 'cognito/login')
        return axios.post(route, payload)
    },
    logout() {
        const route = baseURL(api, 'cognito/logout')
        return axios.post(route, {}, { headers: getHeaders() })
    },
    resetPassword(payload: ResetPasswordPayload) {
        const route = baseURL(api, 'cognito/reset-password-extranet')
        return axios.post(route, payload, { headers: getHeaders() })
    },
    register(payload: RegisterPayload) {
        const route = baseURL(api, 'cognito/sign-up')
        return axios.post(route, payload, { headers: getHeaders() })
    },
    changePassword(payload: ChangePasswordPayload) {
        const route = baseURL(api, 'cognito/change-password')
        return axios.post(route, payload, { headers: getHeaders() })
    },
}
