import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../Quincenal'

interface RecargoNocturnoInterface {
    roster_id: number
    recargo_nocturno_post: string
    recargo_nocturno_actual: string
    hours_recargo_nocturno_variation: string
    porcentaje: number
}

export const columnsRecargoNocturno: ColumnDef<RecargoNocturnoInterface>[] = [
    {
        accessorKey: 'roster_id',
        header: 'Roster ID',
    },
    {
        accessorKey: 'recargo_nocturno_post',
        header: 'Recargo Nocturno Posterior',
    },
    {
        accessorKey: 'recargo_nocturno_actual',
        header: 'Recargo Nocturno Actual',
    },
    {
        accessorKey: 'hours_recargo_nocturno_variation',
        header: 'Hrs Recargo Nocturno Variación',
    },
    {
        accessorKey: 'porcentaje',
        header: 'Variación Recargo Nocturno',
        cell: info => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}
            >
                {info.getValue() as number}%
            </span>
        ),
    },
]
