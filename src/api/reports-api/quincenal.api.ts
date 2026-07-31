import axios from 'axios'
import { getHeaders } from '@/utils'
import { baseURL } from '../baseURL'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

/**
 * Params de todos los endpoints de variación quincenal.
 *
 * `priorPayrollId` es opcional: si no se manda, el backend deriva la quincena
 * anterior a partir de `currentPayrollId`. Solo se envía para comparar contra un
 * periodo que NO sea el inmediatamente anterior.
 */
export interface QuincenaVariationParams
    extends Record<string, string | number | undefined> {
    uadId: number
    /** Quincena actual, la que se compara contra la anterior. e.g. 202607012 */
    currentPayrollId: number
    /** Quincena anterior, la base de la comparación. e.g. 202607011 */
    priorPayrollId?: number
}

/**
 * Las horas ya vienen en horas decimales y redondeadas a 2 decimales desde el
 * backend, igual que los porcentajes. No hace falta post-procesarlas.
 *
 * `cuenta` es nullable a propósito: las UADs de Colombia (43 TPG, 46 Verizon) no
 * tienen columna `cuenta`, y en ese caso llega una sola fila agregada con
 * `cuenta = null`.
 */
export interface ExtrasSimpleVariationRow {
    cuenta: string | null
    extras_simple_prior: number
    extras_simple_current: number
    hrs_simple_variation: number
    pct_variation_extras_simple: number
}

export interface ExtrasWpVariationRow {
    cuenta: string | null
    extras_wp_prior: number
    extras_wp_current: number
    hrs_wp_variation: number
    pct_variation_extras_wp: number
}

export interface TotalExtrasSimpleVariationRow {
    cuenta: string | null
    total_extras_simple_prior: number
    total_extras_simple_current: number
    hrs_total_variation: number
    pct_variation_total_extras: number
}

export interface ExtrasDddVariationRow {
    cuenta: string | null
    extras_ddd_prior: number
    extras_ddd_current: number
    hrs_ddd_variation: number
    pct_variation_extras_ddd: number
}

export interface QuincenaVariationResponse<T> {
    status: number
    data: T[]
}

export const quincenasApi = {
    getExtrasSimples(params: QuincenaVariationParams) {
        const route = baseURL(api, 'quincenas-ope/extras-simples', params)
        return axios.get<QuincenaVariationResponse<ExtrasSimpleVariationRow>>(route, {
            headers: getHeaders(),
            timeout: 65000,
        })
    },

    getExtrasWp(params: QuincenaVariationParams) {
        const route = baseURL(api, 'quincenas-ope/extras-wp', params)
        return axios.get<QuincenaVariationResponse<ExtrasWpVariationRow>>(route, {
            headers: getHeaders(),
            timeout: 65000,
        })
    },

    getTotalExtrasSimples(params: QuincenaVariationParams) {
        const route = baseURL(api, 'quincenas-ope/total-extras-simples', params)
        return axios.get<QuincenaVariationResponse<TotalExtrasSimpleVariationRow>>(
            route,
            {
                headers: getHeaders(),
                timeout: 65000,
            },
        )
    },

    getExtrasDdd(params: QuincenaVariationParams) {
        const route = baseURL(api, 'quincenas-ope/extras-ddd', params)
        return axios.get<QuincenaVariationResponse<ExtrasDddVariationRow>>(route, {
            headers: getHeaders(),
            timeout: 65000,
        })
    },
}
