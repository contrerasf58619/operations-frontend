import axios from 'axios'
import { getHeaders } from '@/utils'
import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

export interface User {
    ROSTER_ID: number
    LAST_NAME: string
    FIRST_NAME: string
}

export interface CoachingSession {
    id?: number
    leader_name: string
    agent_name: string
    agent_employee_code: string
    agent_email: string
    coaching_date: string
    coaching_type: string
    metric: string
    behavioral_indicator: string
    coaching_comments: string
    strengths: string
    opportunities: string
    action_plan: string
    leader_commitment: string
    coaching_related_attachments: string
    created_at?: string
    created_by: string
    leader_code: string
}

export const coachingSessionApi = {
    getUserByEmployeeCode(uadId: number, employeeCodeList: string) {
        const route = baseURL(api, 'coaching-session/get-users-by-employee-code')
        return axios.get<User[]>(route, {
            headers: getHeaders(),
            params: { uadId, employeeCodeList },
        })
    },

    uploadAttachment(files: FileList) {
        const route = baseURL(api, 'coaching-session/upload-attachment')
        const requests = Array.from(files).map(file => {
            const formData = new FormData()
            formData.append('file', file)
            return axios
                .post(route, formData, {
                    headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' },
                })
                .then(response => response.data.data)
        })
        return Promise.all(requests)
    },

    createCoachingSession(data: CoachingSession) {
        const route = baseURL(api, 'coaching-session/create')
        return axios.post(route, data, { headers: getHeaders() })
    },

    getCoachingSessions(uadId: number) {
        const route = baseURL(api, `coaching-session/list`)
        return axios.get<CoachingSession[]>(route, {
            headers: getHeaders(),
            params: { uadId },
        })
    },

    getSignatures(s3Key: string) {
        const route = baseURL(api, `coaching-session/get-signed-url`)
        return axios.get<string>(route, {
            headers: getHeaders(),
            params: { s3Key },
        })
    },
}
