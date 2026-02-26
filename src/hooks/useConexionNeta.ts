import { conexionNetaApi } from "@/api/conexionNeta.api"
import { ConexionNeta } from "@/interfaces/conexionNeta.interface"
import { useEffect, useState } from "react"

export function useConexionNeta() {
    const [conexionNeta, setConexionNeta] = useState<ConexionNeta[] | undefined>(undefined)

    const fetchConexionNeta = () => {
        conexionNetaApi.getConexionNeta('2026-02-08', '2026-02-14', 1)
        .then(resp => {
            let ncDataFormatted: ConexionNeta[] = []
            resp.data.data.forEach((item: any) => {
                ncDataFormatted.push({
                    roster_id: item.Codigo_Agente,
                    nombre: item.Nombre_Agente,
                    fecha: new Date(item.Fecha),
                    nomenclatura: item.Asistencia_Planificacion,
                    from_time: new Date(item.From_Time_Planning),
                    to_time: new Date(item.To_Time_Planning),
                    planning: item.Planificacion_Diaria
                });
            });
            setConexionNeta(ncDataFormatted)
        })
    }

    return { conexionNeta, fetchConexionNeta }
}