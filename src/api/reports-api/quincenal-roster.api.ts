import axios from 'axios'
import { getHeaders } from '@/utils'
import { baseURL } from '../baseURL'
import type { QuincenaVariationParams, QuincenaVariationResponse } from './quincenal.api'

const api = process.env.NEXT_PUBLIC_URL_UAD_NEST

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_UAD_NEST in your .env file')
}

/**
 * Variación quincenal agrupada por ROSTER (empleado).
 *
 * Mismas medidas y mismo cálculo que `quincenal.api.ts`; lo único que cambia es
 * la dimensión: una fila por empleado en vez de una por cuenta. Por eso se
 * reutilizan `QuincenaVariationParams` y `QuincenaVariationResponse` — los query
 * params y la envoltura `{ status, data }` son idénticos.
 *
 * Backend: `GET /quincenas-ope/roster/*`
 */

/**
 * Columnas de identificación que traen todas las filas por roster.
 *
 * `cuenta` es nullable por la misma razón que en el reporte por cuenta: las UADs
 * de Colombia (43 TPG, 46 Verizon) no tienen esa columna. A diferencia del
 * reporte por cuenta —que ahí colapsa a una sola fila agregada— en modo roster
 * se siguen devolviendo las filas por empleado, solo que con `cuenta = null`.
 *
 * `name` viene del propio `conexion_neta`, así que no hace falta resolver el
 * nombre contra el roster por separado.
 */
export interface QuincenaRosterDimensions {
    roster_id: number | null
    name: string | null
    cuenta: string | null
}

/**
 * Las horas ya vienen en horas decimales y redondeadas a 2 decimales desde el
 * backend, igual que los porcentajes. No hace falta post-procesarlas.
 */
export interface ExtrasSimpleVariationByRosterRow extends QuincenaRosterDimensions {
    extras_simple_prior: number
    extras_simple_current: number
    hrs_simple_variation: number
    pct_variation_extras_simple: number
}

export interface ExtrasWpVariationByRosterRow extends QuincenaRosterDimensions {
    extras_wp_prior: number
    extras_wp_current: number
    hrs_wp_variation: number
    pct_variation_extras_wp: number
}

export interface TotalExtrasSimpleVariationByRosterRow extends QuincenaRosterDimensions {
    total_extras_simple_prior: number
    total_extras_simple_current: number
    hrs_total_variation: number
    pct_variation_total_extras: number
}

export interface ExtrasDddVariationByRosterRow extends QuincenaRosterDimensions {
    extras_ddd_prior: number
    extras_ddd_current: number
    hrs_ddd_variation: number
    pct_variation_extras_ddd: number
}

export const quincenasRosterApi = {
    getExtrasSimplesByRoster(params: QuincenaVariationParams) {
        const route = baseURL(api, 'quincenas-ope/roster/extras-simples', params)
        return axios.get<QuincenaVariationResponse<ExtrasSimpleVariationByRosterRow>>(route, {
            headers: getHeaders(),
            timeout: 65000,
        })
    },

    getExtrasWpByRoster(params: QuincenaVariationParams) {
        const route = baseURL(api, 'quincenas-ope/roster/extras-wp', params)
        return axios.get<QuincenaVariationResponse<ExtrasWpVariationByRosterRow>>(route, {
            headers: getHeaders(),
            timeout: 65000,
        })
    },

    getTotalExtrasSimplesByRoster(params: QuincenaVariationParams) {
        const route = baseURL(api, 'quincenas-ope/roster/total-extras-simples', params)
        return axios.get<QuincenaVariationResponse<TotalExtrasSimpleVariationByRosterRow>>(route, {
            headers: getHeaders(),
            timeout: 65000,
        })
    },

    getExtrasDddByRoster(params: QuincenaVariationParams) {
        const route = baseURL(api, 'quincenas-ope/roster/extras-ddd', params)
        return axios.get<QuincenaVariationResponse<ExtrasDddVariationByRosterRow>>(route, {
            headers: getHeaders(),
            timeout: 65000,
        })
    },
}
