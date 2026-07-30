import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { InconsistenciaRow } from '../types'
import { TIPOS_DESCONEXION } from '../constanst'
import dayjs from 'dayjs'

export const useInconsistenciasColumns = (
    handleTipoDesconexionChange: (targetRow: InconsistenciaRow, value: string) => void,
    handleMotivoChange: (targetRow: InconsistenciaRow, value: string) => void,
) => {
    const columns = useMemo<ColumnDef<InconsistenciaRow, any>[]>(
        () => [
            {
                accessorKey: 'legajo',
                header: 'Legajo',
                size: 80,
            },
            {
                accessorKey: 'documento',
                header: 'Documento',
                size: 100,
            },
            {
                accessorKey: 'nombreCompleto',
                header: 'Nombre Completo',
                size: 180,
            },
            {
                accessorKey: 'fecha',
                header: 'Fecha',
                size: 110,
                cell: ({ getValue }) => {
                    const val = getValue() as string
                    return val ? dayjs(val).format('DD/MM/YYYY') : '-'
                },
            },
            {
                accessorKey: 'ingreso',
                header: 'Ingreso',
                size: 140,
                cell: ({ getValue }) => {
                    const val = getValue() as string
                    return val || '-'
                },
            },
            {
                accessorKey: 'salida',
                header: 'Salida',
                size: 140,
                cell: ({ getValue }) => {
                    const val = getValue() as string
                    return val || '-'
                },
            },
            {
                accessorKey: 'inconsistencia',
                header: 'Inconsistencia',
                size: 120,
            },
            {
                accessorKey: 'descripcion',
                header: 'Descripción',
                size: 200,
            },
            {
                accessorKey: 'intervaloDesde',
                header: 'Intervalo Desde',
                size: 140,
                cell: ({ getValue }) => {
                    const val = getValue() as string
                    return val || '-'
                },
            },
            {
                accessorKey: 'intervaloHasta',
                header: 'Intervalo Hasta',
                size: 140,
                cell: ({ getValue }) => {
                    const val = getValue() as string
                    return val || '-'
                },
            },
            {
                accessorKey: 'tipoDesconexion',
                header: 'Tipo de Desconexión',
                size: 180,
                cell: ({ row }) => (
                    <select
                        value={row.original.tipoDesconexion}
                        onChange={e => handleTipoDesconexionChange(row.original, e.target.value)}
                        className='w-full px-2 py-1.5 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                    >
                        {TIPOS_DESCONEXION.map(tipo => (
                            <option key={tipo.value} value={tipo.value}>
                                {tipo.label}
                            </option>
                        ))}
                    </select>
                ),
            },
            {
                accessorKey: 'motivo',
                header: 'Motivo',
                size: 220,
                cell: ({ row }) => (
                    <input
                        type='text'
                        value={row.original.motivo}
                        onChange={e => handleMotivoChange(row.original, e.target.value)}
                        placeholder='Ingrese motivo...'
                        className='w-full px-2 py-1.5 rounded border border-gray-300 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400'
                    />
                ),
            },
        ],
        [handleTipoDesconexionChange, handleMotivoChange],
    )

    return {
        columns,
    }
}
