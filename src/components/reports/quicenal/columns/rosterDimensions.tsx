import { ColumnDef } from '@tanstack/react-table'
import { QuincenaRosterDimensions } from '@/api/reports-api/quincenal-roster.api'

/**
 * Columnas de identificación que abren todas las tablas por roster.
 *
 * Son idénticas en las cinco medidas, así que se generan desde aquí en vez de
 * repetirlas archivo por archivo. Cada `columnsRoster*` las expande al inicio de
 * su arreglo y luego añade sus propias columnas de periodos.
 *
 * `roster_id`, `name` y `cuenta` son nullables: `cuenta` llega en null en las UADs
 * de Colombia (43 TPG, 46 Verizon), que no tienen esa columna.
 */
export const rosterDimensionColumns = <TData extends QuincenaRosterDimensions>(): ColumnDef<
    TData,
    any
>[] => [
    {
        accessorKey: 'roster_id',
        header: 'Roster ID',
        cell: info => (info.getValue() as number | null) ?? '—',
    },
    {
        accessorKey: 'name',
        header: 'Nombre',
        cell: info => (info.getValue() as string | null) ?? '—',
    },
    {
        accessorKey: 'cuenta',
        header: 'Cuenta',
        cell: info => (info.getValue() as string | null) ?? '—',
    },
]
