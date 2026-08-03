import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../shared'
import { ExtrasWpVariationRow } from '@/api/reports-api/quincenal.api'
import { ExtrasWpVariationByRosterRow } from '@/api/reports-api/quincenal-roster.api'
import { rosterDimensionColumns } from './rosterDimensions'

export const columnsExtrasWp: ColumnDef<ExtrasWpVariationRow>[] = [
    {
        accessorKey: 'cuenta',
        header: 'Cuenta',
        cell: info => (info.getValue() as string | null) ?? '—',
    },
    {
        accessorKey: 'extras_wp_prior',
        header: 'Extras WP Quincena Anterior',
    },
    {
        accessorKey: 'extras_wp_current',
        header: 'Extras WP Quincena Actual',
    },
    {
        accessorKey: 'hrs_wp_variation',
        header: 'Hrs WP Variación',
    },
    {
        accessorKey: 'pct_variation_extras_wp',
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

/** Misma medida, una fila por empleado. Backend: `/quincenas-ope/roster/extras-wp`. */
export const columnsRosterExtrasWp: ColumnDef<ExtrasWpVariationByRosterRow>[] = [
    ...rosterDimensionColumns<ExtrasWpVariationByRosterRow>(),
    {
        accessorKey: 'extras_wp_prior',
        header: 'Extras WP Quincena Anterior',
    },
    {
        accessorKey: 'extras_wp_current',
        header: 'Extras WP Quincena Actual',
    },
    {
        accessorKey: 'hrs_wp_variation',
        header: 'Hrs WP Variación',
    },
    {
        accessorKey: 'pct_variation_extras_wp',
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
