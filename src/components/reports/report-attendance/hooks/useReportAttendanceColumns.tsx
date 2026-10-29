import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { ReportAttendanceRow } from '../types'
import dayjs from 'dayjs'

export const useReportAttendanceColumns = () => {
    const columns = useMemo<ColumnDef<ReportAttendanceRow, any>[]>(
        () => [
            {
                accessorKey: 'roster_id',
                header: 'Roster ID',
                size: 80,
            },
            {
                accessorKey: 'fecha',
                header: 'Fecha',
                size: 80,
                cell: ({ getValue }) => {
                    const val = getValue() as string
                    return val ? dayjs(val).utc().locale('es').format('DD/MM/YYYY') : '-'
                },
            },
            {
                accessorKey: 'asistencia',
                header: 'Asistencia',
                size: 80,
            },
            {
                accessorKey: 'pase',
                header: 'Pase',
                size: 80,
                cell: ({ getValue }) => {
                    const val = getValue() as string
                    return val || '-'
                },
            },
            {
                accessorKey: 'ajuste',
                header: 'Ajuste',
                size: 80,
                cell: ({ getValue }) => {
                    const val = getValue() as string
                    return val || '-'
                },
            },
            {
                accessorKey: 'asistencia_final',
                header: 'Asistencia final',
                size: 80,
                cell: ({ getValue }) => {
                    const val = getValue() as string
                    return val || '-'
                },
            },
        ],
        [],
    )

    return {
        columns,
    }
}
