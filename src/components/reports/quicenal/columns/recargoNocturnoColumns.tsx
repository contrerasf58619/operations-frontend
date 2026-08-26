import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../shared'
import { rosterDimensionColumns } from './rosterDimensions'

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

/**
 * A diferencia de las otras cuatro medidas, recargo nocturno TODAVIA NO tiene
 * endpoint en el backend (ni por cuenta ni por roster), asi que esta forma se
 * declara aqui en lugar de importarse de `quincenal-roster.api`. Al conectarse,
 * reemplazar esta interfaz por el tipo que exporte el api.
 */
interface RecargoNocturnoByRosterInterface {
    roster_id: number | null
    name: string | null
    cuenta: string | null
    recargo_nocturno_post: string
    recargo_nocturno_actual: string
    hours_recargo_nocturno_variation: string
    porcentaje: number
}

export const columnsRosterRecargoNocturno: ColumnDef<RecargoNocturnoByRosterInterface>[] = [
    ...rosterDimensionColumns<RecargoNocturnoByRosterInterface>(),
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
