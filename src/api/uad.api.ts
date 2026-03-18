import axios, { AxiosResponse } from 'axios'
import { getHeaders } from '@/utils'
import { UAD_CATALOG, type UadCatalogOption } from '@/constants/uads'

import { baseURL } from './baseURL'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

export const uadApi = {
    async getAllUADs() {
        try {
            const route = baseURL(api, 'uads')
            const response = await axios.get<{ status: number; data: UadCatalogOption[] }>(route, {
                headers: getHeaders(),
            })
            const apiData = Array.isArray(response.data?.data) ? response.data.data : []

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
    async getUADs(employeeCode: number) {
        const queryVariants = [
            { employeeCode },
            { rosterId: employeeCode },
            { employeeId: employeeCode },
        ]

        const responses = await Promise.allSettled(
            queryVariants.map(params => {
                const route = baseURL(api, 'uads/uads-by-roster', params)
                return axios.get(route, { headers: getHeaders() })
            }),
        )

        const mergedRows: any[] = []
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

function extractUadRows(response: AxiosResponse<any>): any[] {
    return Array.isArray(response.data?.data) ? response.data.data : []
}

function getResponseStatus(responses: PromiseSettledResult<AxiosResponse<any>>[]): number {
    const fulfilledResponse = responses.find(
        (response): response is PromiseFulfilledResult<AxiosResponse<any>> =>
            response.status === 'fulfilled',
    )

    return fulfilledResponse?.value.status ?? 200
}

function mergeUadCatalog(options: UadCatalogOption[]): UadCatalogOption[] {
    const mergedCatalog = [...options, ...UAD_CATALOG]
    const seenValues = new Set<number>()

    return mergedCatalog.filter(option => {
        if (!Number.isFinite(option.value) || seenValues.has(option.value)) {
            return false
        }

        seenValues.add(option.value)
        return true
    })
}
