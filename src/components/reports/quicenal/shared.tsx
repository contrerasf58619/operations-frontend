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

const PCT_GREEN = 'text-green-600 bg-green-50'
const PCT_YELLOW = 'text-yellow-600 bg-yellow-50'
const PCT_RED = 'text-red-600 bg-red-50'

/**
 * Semaforo de la variacion porcentual.
 *
 * Una caida fuerte importa igual que una subida fuerte, asi que los negativos se
 * evaluan por su propia escala en vez de caer todos en verde (el bug anterior:
 * `porcentaje <= 10` daba verde a CUALQUIER negativo, -80% incluido).
 *
 * Los umbrales NO son simetricos, es a proposito:
 *
 *   subida:  [0, 10]    verde | (10, 15]    amarillo | > 15    rojo
 *   caida:   [0, -10]   verde | (-10, -20]  amarillo | < -20   rojo
 *
 * Un `NaN` (fila sin dato) cae en rojo, igual que antes.
 */
export const getPercentageColor = (porcentaje: number) => {
    if (porcentaje < 0) {
        if (porcentaje >= -10) return PCT_GREEN
        if (porcentaje >= -20) return PCT_YELLOW
        return PCT_RED
    }

    if (porcentaje <= 10) return PCT_GREEN
    if (porcentaje <= 15) return PCT_YELLOW
    return PCT_RED
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
