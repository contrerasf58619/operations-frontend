import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../AlertsReport'

interface HorasExtraInterface {
    roster_id: number
    semana: string
    extras: string
    tiempo_productivo: string
    porcentaje: number
}

export const columnsUpdate: ColumnDef<HorasExtraInterface>[] = [
    {
        accessorKey: 'roster_id',
        header: 'Roster ID',
    },
    {
        accessorKey: 'week_start_date',
        header: 'Semana',
    },
    {
        accessorKey: 'extras',
        header: 'Extras',
    },
    {
        accessorKey: 'tiempo_productivo',
        header: 'Tiempo Productivo',
    },
    {
        accessorKey: 'porcentaje',
        header: 'Porcentaje',
        cell: info => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}
            >
                {info.getValue() as number}%
            </span>
        ),
    },
]
