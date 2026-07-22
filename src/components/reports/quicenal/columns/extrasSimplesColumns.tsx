import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../Quincenal'

interface HorasExtraSimplesInterface {
    roster_id: number
    extras_simples_post: string
    extras_simples_actual: string
    hours_simple_variation: string
    porcentaje: number
}

export const columnsExtrasSimples: ColumnDef<HorasExtraSimplesInterface>[] = [
    {
        accessorKey: 'roster_id',
        header: 'Roster ID',
    },
    {
        accessorKey: 'extras_simples_post',
        header: 'Extras Simples Posterior',
    },
    {
        accessorKey: 'extras_simples_actual',
        header: 'Extras Simples Actual',
    },
    {
        accessorKey: 'hours_simple_variation',
        header: 'Hrs Simples Variación',
    },
    {
        accessorKey: 'porcentaje',
        header: 'Variación Extras Simples',
        cell: info => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}
            >
                {info.getValue() as number}%
            </span>
        ),
    },
]
