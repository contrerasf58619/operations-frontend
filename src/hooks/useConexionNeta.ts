'use client'

import { conexionNetaApi } from '@/api/conexionNeta.api'
import { useDateContext } from '@/context/UI/DateContext'
import { useUadContext } from '@/context/uad/UadContext'
import { ConexionNeta } from '@/interfaces/conexionNeta.interface'
import { useEffect, useState } from 'react'

export function useConexionNeta() {
    const [conexionNeta, setConexionNeta] = useState<ConexionNeta[]>([])
    const [loading, setLoading] = useState(false)
    const { dateRange } = useDateContext()
    const { selectedUad } = useUadContext()

    useEffect(() => {
        let isMounted = true

        const fetchConexionNeta = async () => {
            if (selectedUad === null) {
                setConexionNeta([])
                return
            }

            setLoading(true)

            try {
                const [startDate, endDate] = dateRange
                const resp = await conexionNetaApi.getConexionNeta(startDate, endDate, selectedUad)
                const data = Array.isArray(resp.data?.data) ? resp.data.data : []
                const formattedData = data.map((item: any) => ({
                    roster_id: item.Codigo_Agente,
                    nombre: item.Nombre_Agente,
                    fecha: new Date(item.Fecha),
                    nomenclatura: item.Asistencia_Planificacion,
                    from_time: new Date(item.From_Time_Planning),
                    to_time: new Date(item.To_Time_Planning),
                    planning: item.Planificacion_Diaria,
                }))

                if (isMounted) {
                    setConexionNeta(formattedData)
                }
            } catch (error) {
                console.error('Error fetching Conexion Neta:', error)

                if (isMounted) {
                    setConexionNeta([])
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchConexionNeta()

        return () => {
            isMounted = false
        }
    }, [dateRange, selectedUad])

    return { conexionNeta, loading }
}
