import { ColumnDef } from '@tanstack/react-table'
import { getPercentageColor } from '../AlertsReport'

interface ColumnsInterface {
    roster_id: number
    semana: string
    horas_asueto: string
    horas_productivas: string
    porcentaje: number
}

export const columnsVacations: ColumnDef<ColumnsInterface>[] = [
    {
        accessorKey: 'roster_id',
        header: 'Roster ID',
    },
    {
        accessorKey: 'semana',
        header: 'Semana',
    },
    {
        accessorKey: 'horas_asueto',
        header: 'Horas en Asueto',
    },
    {
        accessorKey: 'horas_productivas',
        header: 'Horas Productivas',
    },
    {
        accessorKey: 'porcentaje',
        header: 'Porcentaje',
        cell: info => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPercentageColor(Number(info.getValue()))}`}
            >
                {info.getValue() as number}%
            </span>
        ),
    },
]
