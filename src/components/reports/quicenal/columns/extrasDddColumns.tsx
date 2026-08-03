import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../shared'
import { ExtrasDddVariationRow } from '@/api/reports-api/quincenal.api'
import { ExtrasDddVariationByRosterRow } from '@/api/reports-api/quincenal-roster.api'
import { rosterDimensionColumns } from './rosterDimensions'

export const columnsExtrasDDD: ColumnDef<ExtrasDddVariationRow>[] = [
    {
        accessorKey: 'cuenta',
        header: 'Cuenta',
        cell: info => (info.getValue() as string | null) ?? '—',
    },
    {
        accessorKey: 'extras_ddd_prior',
        header: 'Extras DDD Quincena Anterior',
    },
    {
        accessorKey: 'extras_ddd_current',
        header: 'Extras DDD Quincena Actual',
    },
    {
        accessorKey: 'hrs_ddd_variation',
        header: 'Hrs DDD Variación',
    },
    {
        accessorKey: 'pct_variation_extras_ddd',
        header: 'Variación Extras DDD',
        cell: info => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}
            >
                {info.getValue() as number}%
            </span>
        ),
    },
]

/** Misma medida, una fila por empleado. Backend: `/quincenas-ope/roster/extras-ddd`. */
export const columnsRosterExtrasDDD: ColumnDef<ExtrasDddVariationByRosterRow>[] = [
    ...rosterDimensionColumns<ExtrasDddVariationByRosterRow>(),
    {
        accessorKey: 'extras_ddd_prior',
        header: 'Extras DDD Quincena Anterior',
    },
    {
        accessorKey: 'extras_ddd_current',
        header: 'Extras DDD Quincena Actual',
    },
    {
        accessorKey: 'hrs_ddd_variation',
        header: 'Hrs DDD Variación',
    },
    {
        accessorKey: 'pct_variation_extras_ddd',
        header: 'Variación Extras DDD',
        cell: info => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}
            >
                {info.getValue() as number}%
            </span>
        ),
    },
]
