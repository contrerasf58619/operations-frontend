import { useState, useCallback } from 'react'
import axios from 'axios'
import {
    conexionNetaOperacionesApi,
    ConexionNetaOpeParams,
} from '@/api/conexion-neta/conexion-neta-operaciones.api'
import {
    DatumGT,
    DatumWild,
} from '@/components/reports/operaciones/interfaces/ConexionNetaOpeRow.interface'

function describeFetchError(err: unknown, label: string) {
    const axiosErr = axios.isAxiosError(err) ? err : null
    const status = axiosErr?.response?.status
    const backendMessage =
        (axiosErr?.response?.data as { message?: string } | undefined)?.message ??
        axiosErr?.message ??
        (err instanceof Error ? err.message : String(err))

    console.error(`[useConexionNetaOpe] ${label} failed`, {
        url: axiosErr?.config?.url,
        status,
        code: axiosErr?.code,
        message: backendMessage,
        data: axiosErr?.response?.data,
    })

    if (axiosErr?.code === 'ECONNABORTED') {
        return `Tiempo de espera agotado al cargar los datos de ${label}.`
    }
    if (status) {
        return `Error ${status} al cargar los datos de ${label}: ${backendMessage}`
    }
    return `Error al cargar los datos de ${label}.`
}

interface UseConexionNetaOpeState {
    data: DatumWild[]
    dataGT: DatumGT[]
    loading: boolean
    loadingGT: boolean
    error: string | null
}

export const useConexionNetaOpe = () => {
    const [state, setState] = useState<UseConexionNetaOpeState>({
        data: [],
        dataGT: [],
        loading: false,
        loadingGT: false,
        error: null,
    })

    const fetchConexionNeta = useCallback(async (params: ConexionNetaOpeParams) => {
        setState(prev => ({ ...prev, loading: true, error: null }))
        try {
            const res = await conexionNetaOperacionesApi.getConexionNeta(params)
            setState(prev => ({ ...prev, data: res.data.data, loading: false }))
        } catch (err) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: describeFetchError(err, 'conexión neta'),
            }))
        }
    }, [])

    const fetchConexionNetaGT = useCallback(async (params: ConexionNetaOpeParams) => {
        setState(prev => ({ ...prev, loadingGT: true, error: null }))
        try {
            const res = await conexionNetaOperacionesApi.getConexionNetaOpeGT(params)
            setState(prev => ({ ...prev, dataGT: res.data.data, loadingGT: false }))
        } catch (err) {
            setState(prev => ({
                ...prev,
                loadingGT: false,
                error: describeFetchError(err, 'conexión neta GT'),
            }))
        }
    }, [])

    return {
        ...state,
        fetchConexionNeta,
        fetchConexionNetaGT,
    }
}
