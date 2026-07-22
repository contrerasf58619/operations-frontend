import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../Quincenal'

interface TotalHorasExtraSimplesInterface {
    roster_id: number
    total_extras_simples_post: string
    total_extras_simples_actual: string
    total_extras_simples_variation: string
    porcentaje: number
}

export const columnsExtrasSimples: ColumnDef<TotalHorasExtraSimplesInterface>[] = [
    {
        accessorKey: 'roster_id',
        header: 'Roster ID',
    },
    {
        accessorKey: 'total_extras_simples_post',
        header: 'Extras Simples Posterior',
    },
    {
        accessorKey: 'total_extras_simples_actual',
        header: 'Extras Simples Actual',
    },
    {
        accessorKey: 'total_extras_simples_variation',
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
