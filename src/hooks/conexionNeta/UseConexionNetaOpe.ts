import { useState, useCallback } from 'react'
import {
    conexionNetaOperacionesApi,
    ConexionNetaOpeParams,
} from '@/api/conexion-neta/conexion-neta-operaciones.api'
import { ConexionNetaOpeRow } from '@/components/reports/operaciones/interfaces/ConexionNetaOpeRow.interface'

interface UseConexionNetaOpeState {
    data: ConexionNetaOpeRow[]
    dataGT: ConexionNetaOpeRow[]
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
        } catch {
            setState(prev => ({
                ...prev,
                loading: false,
                error: 'Error al cargar los datos de conexión neta.',
            }))
        }
    }, [])

    const fetchConexionNetaGT = useCallback(async (params: ConexionNetaOpeParams) => {
        setState(prev => ({ ...prev, loadingGT: true, error: null }))
        try {
            const res = await conexionNetaOperacionesApi.getConexionNetaOpeGT(params)
            setState(prev => ({ ...prev, dataGT: res.data.data, loadingGT: false }))
        } catch {
            setState(prev => ({
                ...prev,
                loadingGT: false,
                error: 'Error al cargar los datos de conexión neta GT.',
            }))
        }
    }, [])

    return {
        ...state,
        fetchConexionNeta,
        fetchConexionNetaGT,
    }
}
