'use client'

import { useConexionNeta } from '@/hooks/useConexionNeta'

export function ConexionNetaTable() {
    const { conexionNeta, loading } = useConexionNeta()

    return (
        <div>
            <h2>Conexion Neta</h2>
            <table className='w-full'>
                <thead>
                    <tr className='bg-gray-50 border-b border-gray-200'>
                        <th className='px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide'>
                            Codigo
                        </th>
                        <th className='px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide'>
                            Nombre
                        </th>
                        <th className='px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide'>
                            Fecha
                        </th>
                        <th className='px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide'>
                            Nomenclatura
                        </th>
                        <th className='px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide'>
                            Horario
                        </th>
                        <th className='px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wide'>
                            Planning
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                    {loading && (
                        <tr>
                            <td colSpan={6} className='px-3 py-4 text-center text-sm text-gray-500'>
                                Loading data...
                            </td>
                        </tr>
                    )}
                    {!loading && conexionNeta.length === 0 && (
                        <tr>
                            <td colSpan={6} className='px-3 py-4 text-center text-sm text-gray-500'>
                                No results found for the selected UAD.
                            </td>
                        </tr>
                    )}
                    {!loading &&
                        conexionNeta.map((item, index) => (
                            <tr key={index} className='hover:bg-indigo-50/30 transition-colors'>
                                <td className='px-3 py-2 text-xs text-gray-800'>
                                    {item.roster_id}
                                </td>
                                <td className='px-3 py-2 text-xs text-gray-800'>{item.nombre}</td>
                                <td className='px-3 py-2 text-xs text-gray-800'>
                                    {item.fecha.toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                    })}
                                </td>
                                <td className='px-3 py-2 text-xs text-center'>
                                    {item.nomenclatura}
                                </td>
                                <td className='px-3 py-2 text-xs text-gray-800'>
                                    {item.from_time.toLocaleTimeString('es-ES')} -{' '}
                                    {item.to_time.toLocaleTimeString('es-ES')}
                                </td>
                                <td className='px-3 py-2 text-xs text-gray-800'>{item.planning}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
