import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/UI/DataTable'

/**
 * Piezas compartidas por los dos reportes quincenales (`CuentaReport` y
 * `RosterReport`).
 *
 * Viven aquí y no en `Quincenal.tsx` para romper el ciclo de imports: los
 * archivos de `columns/` necesitan `getPercentageColor`, y `Quincenal` a su vez
 * importa esas columnas a través de los reportes.
 */

export const getPercentageColor = (porcentaje: number) => {
    if (porcentaje <= 10) return 'text-green-600 bg-green-50'
    if (porcentaje > 10 && porcentaje <= 15) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
}

interface VariationPanelProps<TData> {
    loading: boolean
    error?: unknown
    data: TData[]
    columns: ColumnDef<TData, any>[]
    searchPlaceholder?: string
}

/**
 * Cada tab resuelve su propio estado: los endpoints se consultan en paralelo y no
 * tienen por que terminar al mismo tiempo, asi que un spinner global dejaria tabs
 * ya listos escondidos detras del mas lento.
 */
export function VariationPanel<TData>({
    loading,
    error,
    data,
    columns,
    searchPlaceholder = 'Buscar cuenta...',
}: VariationPanelProps<TData>) {
    if (loading) {
        return (
            <div className='flex justify-center my-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' />
            </div>
        )
    }

    if (error) {
        return (
            <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-600'>
                Ocurrió un error al cargar la información. Intenta de nuevo.
            </div>
        )
    }

    return (
        <DataTable
            data={data}
            columns={columns}
            searchPlaceholder={searchPlaceholder}
            noDataText='No se encontraron variaciones para esta quincena.'
        />
    )
}
