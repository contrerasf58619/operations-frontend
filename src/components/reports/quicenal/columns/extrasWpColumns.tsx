import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../Quincenal'

interface HorasExtraWpInterface {
    roster_id: number
    extras_wp_post: string
    extras_wp_actual: string
    hours_wp_variation: string
    porcentaje: number
}

export const columnsExtrasWp: ColumnDef<HorasExtraWpInterface>[] = [
    {
        accessorKey: 'roster_id',
        header: 'Roster ID',
    },
    {
        accessorKey: 'extras_wp_post',
        header: 'Extras WP Posterior',
    },
    {
        accessorKey: 'extras_wp_actual',
        header: 'Extras WP Actual',
    },
    {
        accessorKey: 'hours_wp_variation',
        header: 'Hrs WP Variación',
    },
    {
        accessorKey: 'porcentaje',
        header: 'Variación Extras WP',
        cell: info => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}
            >
                {info.getValue() as number}%
            </span>
        ),
    },
]
