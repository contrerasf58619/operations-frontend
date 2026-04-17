import { ColumnDef } from '@tanstack/react-table'
// import { getPercentageColor } from '../AlertsReport'

interface ColumnsInterface {
    roster_id: number
    semana: string
    horas_jornada: string
    wp_hours: string
    // porcentaje: number
}

export const columnsWorkday: ColumnDef<ColumnsInterface>[] = [
    {
        accessorKey: 'roster_id',
        header: 'Roster ID',
    },
    {
        accessorKey: 'week_start_date',
        header: 'Semana',
    },
    {
        accessorKey: 'horas_jornada',
        header: 'Horas en Jornada',
    },
    {
        accessorKey: 'wp_hours',
        header: 'Horas WP',
    },
]
