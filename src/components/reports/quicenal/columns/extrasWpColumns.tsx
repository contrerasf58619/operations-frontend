import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../Quincenal'
import { ExtrasWpVariationRow } from '@/api/reports-api/quincenal.api'

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
