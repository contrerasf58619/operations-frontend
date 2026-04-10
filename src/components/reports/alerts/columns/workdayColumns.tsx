import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../AlertsReport'

interface columnsInterface {
    roster_id: number
    semana: string
    horas_jornada: string
    wp_hours: string
    // porcentaje: number
}

export const columnsWorkday: ColumnDef<columnsInterface>[] = [
    {
        accessorKey: 'roster_id',
        header: 'Roster ID',
    },
    {
        accessorKey: 'semana',
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
    // {
    //     accessorKey: 'porcentaje',
    //     header: 'Porcentaje',
    //     cell: info => (
    //         <span
    //             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}
    //         >
    //             {info.getValue() as number}%
    //         </span>
    //     ),
    // },
]
