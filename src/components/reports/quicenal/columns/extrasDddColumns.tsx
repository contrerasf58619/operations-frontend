import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../Quincenal'
import { ExtrasDddVariationRow } from '@/api/reports-api/quincenal.api'

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
