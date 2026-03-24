import axios, { AxiosResponse } from 'axios'
import { getHeaders } from '@/utils'
import { UAD_CATALOG, type UadCatalogOption } from '@/constants/uads'

import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST
const isDevelopment = process.env.NODE_ENV === 'development'

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

type UadApiRow = {
    value?: number | string
    id?: number | string
    uadId?: number | string
    uad_id?: number | string
    name?: string
    label?: string
    uadName?: string
    description?: string
}

type UadApiPayload = {
    status: number
    data: UadApiRow[]
}

type UadApiResult = {
    data: UadApiPayload
}

export const uadApi = {
    async getAllUADs(): Promise<UadApiResult> {
        if (!isDevelopment) {
            return {
                data: {
                    status: 200,
                    data: [],
                },
            }
        }

        try {
            const route = baseURL(api, 'uads')
            const response = await axios.get<UadApiPayload>(route, {
                headers: getHeaders(),
            })
            const apiData = extractUadRows(response)

            return {
                data: {
                    status: response.data?.status ?? response.status,
                    data: mergeUadCatalog(apiData),
                },
            }
        } catch {
            return {
                data: {
                    status: 200,
                    data: UAD_CATALOG,
                },
            }
        }
    },

    async getUADs(employeeCode?: number): Promise<UadApiResult> {
        if (employeeCode === undefined || Number.isNaN(employeeCode)) {
            return {
                data: {
                    status: 200,
                    data: [],
                },
            }
        }

        if (!isDevelopment) {
            const route = baseURL(api, 'uads/uads-by-roster', { employeeId: employeeCode })
            const response = await axios.get<UadApiPayload>(route, {
                headers: getHeaders(),
            })

            return {
                data: {
                    status: response.data?.status ?? response.status,
                    data: extractUadRows(response),
                },
            }
        }

        const queryVariants = [
            { employeeCode },
            { rosterId: employeeCode },
            { employeeId: employeeCode },
        ]

        const responses = await Promise.allSettled(
            queryVariants.map(params => {
                const route = baseURL(api, 'uads/uads-by-roster', params)
                return axios.get<UadApiPayload>(route, { headers: getHeaders() })
            }),
        )

        const mergedRows: UadApiRow[] = []
        const seenValues = new Set<number>()

        responses.forEach(response => {
            if (response.status !== 'fulfilled') {
                return
            }

            const rows = extractUadRows(response.value)

            rows.forEach(row => {
                const rawValue = row?.value ?? row?.id ?? row?.uadId ?? row?.uad_id
                const numericValue = Number(rawValue)

                if (!Number.isFinite(numericValue) || seenValues.has(numericValue)) {
                    return
                }

                seenValues.add(numericValue)
                mergedRows.push(row)
            })
        })

        return {
            data: {
                status: getResponseStatus(responses),
                data: mergedRows,
            },
        }
    },
}

function extractUadRows(response: AxiosResponse<UadApiPayload>): UadApiRow[] {
    return Array.isArray(response.data?.data) ? response.data.data : []
}

function getResponseStatus(
    responses: PromiseSettledResult<AxiosResponse<UadApiPayload>>[],
): number {
    const fulfilledResponse = responses.find(
        (response): response is PromiseFulfilledResult<AxiosResponse<UadApiPayload>> =>
            response.status === 'fulfilled',
    )

    return fulfilledResponse?.value.data?.status ?? fulfilledResponse?.value.status ?? 200
}

function mergeUadCatalog(options: UadApiRow[]): UadCatalogOption[] {
    const normalizedOptions = options
        .map(option => {
            const value = Number(option?.value ?? option?.id ?? option?.uadId ?? option?.uad_id)
            const name = option?.name ?? option?.label ?? option?.uadName ?? option?.description

            if (!Number.isFinite(value) || !name) {
                return null
            }

            return {
                value,
                name: String(name),
            }
        })
        .filter((option): option is UadCatalogOption => option !== null)

    const mergedCatalog = [...normalizedOptions, ...UAD_CATALOG]
    const seenValues = new Set<number>()

    return mergedCatalog.filter(option => {
        if (!Number.isFinite(option.value) || seenValues.has(option.value)) {
            return false
        }

        seenValues.add(option.value)
        return true
    })
}
