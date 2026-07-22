import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../Quincenal'

interface MontoExtrasSimplesInterface {
    roster_id: number
    salario: string
    monto_extras_simples: string
    monto_extras_ddd_asueto: string
    monto_extras_relacionado_a_salario_base: number
}

export const columnsExtrasSimples: ColumnDef<MontoExtrasSimplesInterface>[] = [
    {
        accessorKey: 'roster_id',
        header: 'Roster ID',
    },
    {
        accessorKey: 'salario',
        header: 'Salario',
    },
    {
        accessorKey: 'monto_extras_simples',
        header: 'Monto Extras Simples',
    },
    {
        accessorKey: 'monto_extras_ddd_asueto',
        header: 'Monto Extras DDD Asueto',
    },
    {
        accessorKey: 'monto_extras_relacionado_a_salario_base',
        header: '% Monto Extra Relacionado a Salario Base',
        cell: info => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}
            >
                {info.getValue() as number}%
            </span>
        ),
    },
]
