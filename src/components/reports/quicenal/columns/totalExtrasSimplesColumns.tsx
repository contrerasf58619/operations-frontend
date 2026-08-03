import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../shared'
import { TotalExtrasSimpleVariationRow } from '@/api/reports-api/quincenal.api'
import { TotalExtrasSimpleVariationByRosterRow } from '@/api/reports-api/quincenal-roster.api'
import { rosterDimensionColumns } from './rosterDimensions'

export const columnsTotalExtrasSimples: ColumnDef<TotalExtrasSimpleVariationRow>[] = [
    {
        accessorKey: 'cuenta',
        header: 'Cuenta',
        cell: info => (info.getValue() as string | null) ?? '—',
    },
    {
        accessorKey: 'total_extras_simple_prior',
        header: 'Total Extras Simples Quincena Anterior',
    },
    {
        accessorKey: 'total_extras_simple_current',
        header: 'Total Extras Simples Quincena Actual',
    },
    {
        accessorKey: 'hrs_total_variation',
        header: 'Hrs Total Variación',
    },
    {
        accessorKey: 'pct_variation_total_extras',
        header: 'Variación Total Extras',
        cell: info => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}
            >
                {info.getValue() as number}%
            </span>
        ),
    },
]

/** Misma medida, una fila por empleado. Backend: `/quincenas-ope/roster/total-extras-simples`. */
export const columnsRosterTotalExtrasSimples: ColumnDef<TotalExtrasSimpleVariationByRosterRow>[] = [
    ...rosterDimensionColumns<TotalExtrasSimpleVariationByRosterRow>(),
    {
        accessorKey: 'total_extras_simple_prior',
        header: 'Total Extras Simples Quincena Anterior',
    },
    {
        accessorKey: 'total_extras_simple_current',
        header: 'Total Extras Simples Quincena Actual',
    },
    {
        accessorKey: 'hrs_total_variation',
        header: 'Hrs Total Variación',
    },
    {
        accessorKey: 'pct_variation_total_extras',
        header: 'Variación Total Extras',
        cell: info => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}
            >
                {info.getValue() as number}%
            </span>
        ),
    },
]
