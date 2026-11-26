import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { NoTakeAttendanceRow } from '../types'

interface UseNoTakeAttendanceColumnsProps {
    onViewDetail: (row: NoTakeAttendanceRow) => void
}

export const useNoTakeAttendanceColumns = ({ onViewDetail }: UseNoTakeAttendanceColumnsProps) => {
    const columns = useMemo<ColumnDef<NoTakeAttendanceRow, unknown>[]>(
        () => [
            {
                accessorKey: 'sup_code',
                header: 'Código',
                size: 100,
            },
            {
                accessorKey: 'name',
                header: 'Nombre',
                size: 220,
            },
            {
                accessorKey: 'total_agentes',
                header: 'Total agentes',
                size: 120,
            },
            {
                accessorKey: 'agentes_sin_asistencia',
                header: 'Agentes sin asistencias',
                size: 160,
            },
            {
                accessorKey: 'dias_sin_asistencia',
                header: 'Días sin asistencias',
                size: 160,
            },
            {
                id: 'actions',
                header: 'Acciones',
                size: 130,
                enableSorting: false,
                cell: ({ row }) => {
                    const isDisabled = row.original.agentes_sin_asistencia === 0
                    return (
                        <button
                            type='button'
                            onClick={() => onViewDetail(row.original)}
                            disabled={isDisabled}
                            className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer'
                        >
                            <svg
                                className='w-4 h-4'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.75}
                                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                />
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.75}
                                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                />
                            </svg>
                            Ver detalle
                        </button>
                    )
                },
            },
        ],
        [onViewDetail],
    )

    return {
        columns,
    }
}
