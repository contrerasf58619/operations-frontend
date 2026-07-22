import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../Quincenal'

interface ExtrasDDDAsuetoInterface {
    roster_id: number
    extras_ddd_asueto_post: string
    extras_ddd_asueto_actual: string
    hours_ddd_asueto_variation: string
    porcentaje: number
}

export const columnsExtrasWp: ColumnDef<ExtrasDDDAsuetoInterface>[] = [
    {
        accessorKey: 'roster_id',
        header: 'Roster ID',
    },
    {
        accessorKey: 'extras_ddd_asueto_post',
        header: 'Extras DDD Asueto Posterior',
    },
    {
        accessorKey: 'extras_ddd_asueto_actual',
        header: 'Extras DDD Asueto Actual',
    },
    {
        accessorKey: 'hours_ddd_asueto_variation',
        header: 'Hrs DDD Asueto Variación',
    },
    {
        accessorKey: 'porcentaje',
        header: 'Variación Extras DDD Asueto',
        cell: info => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}
            >
                {info.getValue() as number}%
            </span>
        ),
    },
]
