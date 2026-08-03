import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../Quincenal'
import { ExtrasSimpleVariationRow } from '@/api/reports-api/quincenal.api'

export const columnsExtrasSimples: ColumnDef<ExtrasSimpleVariationRow>[] = [
    {
        accessorKey: 'cuenta',
        header: 'Cuenta',
        cell: info => (info.getValue() as string | null) ?? '—',
    },
    {
        accessorKey: 'extras_simple_prior',
        header: 'Extras Simples Quincena Anterior',
    },
    {
        accessorKey: 'extras_simple_current',
        header: 'Extras Simples Quincena Actual',
    },
    {
        accessorKey: 'hrs_simple_variation',
        header: 'Hrs Simples Variación',
    },
    {
        accessorKey: 'pct_variation_extras_simple',
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
