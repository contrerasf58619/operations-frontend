import { useConexionNeta } from "@/hooks/useConexionNeta"
import { read } from "fs"
import { useEffect } from "react"

export function ConexionNetaTable() {
    const { conexionNeta,fetchConexionNeta } = useConexionNeta()
    useEffect(() => {
        fetchConexionNeta()
    }, [])
    return (
        <div>
            <h2>Conexion Neta</h2>
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th
                            className='px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide'>
                                Codigo
                        </th>
                        <th className='px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide'>Nombre</th>
                        <th className='px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide'>Fecha</th>
                        <th className='px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide'>Nomenclatura</th>
                        <th className='px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide'>Horario</th>
                        <th className='px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide'>Planning</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                    { conexionNeta?.map((item, index) => {
                        console.log(item)
                        //return ''
                        return (
                            <tr key={index} className='hover:bg-indigo-50/30 transition-colors'>
                                <td className='px-3 py-2 text-xs text-gray-800'>{item.roster_id}</td>
                                <td className='px-3 py-2 text-xs text-gray-800'>{item.nombre}</td>
                                <td className='px-3 py-2 text-xs text-gray-800'>{item.fecha.toLocaleDateString('es-ES',{year: 'numeric', month: 'numeric', day: 'numeric'})}</td>
                                <td className="px-3 py-2 text-xs text-center">{item.nomenclatura}</td>
                                <td className='px-3 py-2 text-xs text-gray-800'>{item.from_time.toLocaleTimeString('es-ES')} - {item.to_time.toLocaleTimeString('es-ES')}       </td>
                                <td className='px-3 py-2 text-xs text-gray-800'>{item.planning}</td>
                            </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}