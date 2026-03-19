'use client'

import { UadList } from '@/components/catalogs/UadList'
import { CustomTitle } from '@/components/UI/Custom/CustomTitle'
import { CustomDatePicker } from '@/components/UI/DateTimePicker'
import { useDateContext } from '@/context/UI/DateContext'
import { useUadContext } from '@/context/uad/UadContext'
import { useConexionNetaOpe } from '@/hooks/conexionNeta/UseConexionNetaOpe'
import type { ConexionNetaOpeDatum } from '@/components/reports/operaciones/interfaces/ConexionNetaOpeRow.interface'
import { GT_UAD_IDS } from '@/constants/uads'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type RowKey = keyof ConexionNetaOpeDatum

type TableColumn = {
    id: string
    label: string
    sourceKeys: RowKey[]
    render: (row: ConexionNetaOpeDatum) => ReactNode
    headerClassName?: string
    cellClassName?: string
}

const FALLBACK_COLUMN_IDS = ['ROSTER', 'NOMBRE', 'FECHA', 'HORARIO', 'CONEXION_NETA']

function hasValue(value: unknown) {
    return value !== null && value !== undefined && String(value).trim() !== ''
}

function formatValue(value: unknown) {
    if (!hasValue(value)) {
        return '--'
    }

    return String(value)
}

function sortRowsByRoster(leftRow: ConexionNetaOpeDatum, rightRow: ConexionNetaOpeDatum) {
    return Number(leftRow.ROSTER) - Number(rightRow.ROSTER)
}

const COLUMN_DEFINITIONS: TableColumn[] = [
    {
        id: 'ROSTER',
        label: 'Roster',
        sourceKeys: ['ROSTER'],
        render: row => row.ROSTER,
        cellClassName: 'font-semibold text-charcoal whitespace-nowrap',
    },
    {
        id: 'NOMBRE',
        label: 'Nombre',
        sourceKeys: ['NOMBRE'],
        render: row => row.NOMBRE,
        cellClassName: 'min-w-[220px]',
    },
    {
        id: 'FECHA',
        label: 'Fecha',
        sourceKeys: ['FECHA'],
        render: row => formatValue(row.FECHA),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'NOMENCLATURA',
        label: 'Nomenclatura',
        sourceKeys: ['NOMENCLATURA'],
        render: row => formatValue(row.NOMENCLATURA),
        cellClassName: 'text-center',
    },
    {
        id: 'HORARIO',
        label: 'Horario',
        sourceKeys: ['HORARIO'],
        render: row => formatValue(row.HORARIO),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'PLANNED',
        label: 'Planned',
        sourceKeys: ['PLANNED'],
        render: row => formatValue(row.PLANNED),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'POSICION AGENTE',
        label: 'Posicion Agente',
        sourceKeys: ['POSICION AGENTE'],
        render: row => formatValue(row['POSICION AGENTE']),
    },
    {
        id: 'POSICION SUP',
        label: 'Posicion Sup',
        sourceKeys: ['POSICION SUP'],
        render: row => formatValue(row['POSICION SUP']),
    },
    {
        id: 'WP_HOURS',
        label: 'WP Hours',
        sourceKeys: ['WP_HOURS'],
        render: row => formatValue(row.WP_HOURS),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'LAW_HOURS',
        label: 'Law Hours',
        sourceKeys: ['LAW_HOURS'],
        render: row => formatValue(row.LAW_HOURS),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'CALCULATED_LAW_HOURS',
        label: 'Calculated Law Hours',
        sourceKeys: ['CALCULATED_LAW_HOURS'],
        render: row => formatValue(row.CALCULATED_LAW_HOURS),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'LOGIN AMD',
        label: 'Login AMD',
        sourceKeys: ['LOGIN AMD'],
        render: row => formatValue(row['LOGIN AMD']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'LOGOUT AMD',
        label: 'Logout AMD',
        sourceKeys: ['LOGOUT AMD'],
        render: row => formatValue(row['LOGOUT AMD']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'LOGIN DMD',
        label: 'Login DMD',
        sourceKeys: ['LOGIN DMD'],
        render: row => formatValue(row['LOGIN DMD']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'LOGOUT DMD',
        label: 'Logout DMD',
        sourceKeys: ['LOGOUT DMD'],
        render: row => formatValue(row['LOGOUT DMD']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'STAFFED TIME HORAS',
        label: 'Staffed Time Horas',
        sourceKeys: ['STAFFED TIME HORAS'],
        render: row => formatValue(row['STAFFED TIME HORAS']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'MISSING TIME HORAS',
        label: 'Missing Time Horas',
        sourceKeys: ['MISSING TIME HORAS'],
        render: row => formatValue(row['MISSING TIME HORAS']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'WP_TOTAL',
        label: 'WP Total',
        sourceKeys: ['WP_TOTAL'],
        render: row => formatValue(row.WP_TOTAL),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'VTO',
        label: 'VTO',
        sourceKeys: ['VTO'],
        render: row => formatValue(row.VTO),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'TOTAL',
        label: 'Total',
        sourceKeys: ['TOTAL'],
        render: row => formatValue(row.TOTAL),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'ASISTENCIA',
        label: 'Asistencia',
        sourceKeys: ['ASISTENCIA'],
        render: row => formatValue(row.ASISTENCIA),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'PASE',
        label: 'Pase',
        sourceKeys: ['PASE'],
        render: row => formatValue(row.PASE),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'FINAL',
        label: 'Final',
        sourceKeys: ['FINAL'],
        render: row => formatValue(row.FINAL),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'CONEXION_NETA',
        label: 'Conexión Neta',
        sourceKeys: ['CONEXION_NETA'],
        render: row => formatValue(row.CONEXION_NETA),
        cellClassName: 'font-mono whitespace-nowrap text-teal font-semibold',
    },
    {
        id: 'CONEXION_NETA_CALCULADA',
        label: 'Conexión Neta Calc',
        sourceKeys: ['CONEXION_NETA_CALCULADA'],
        render: row => formatValue(row.CONEXION_NETA_CALCULADA),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'CONEXION_AMD',
        label: 'Conexión AMD',
        sourceKeys: ['CONEXION_AMD'],
        render: row => formatValue(row.CONEXION_AMD),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'CONEXION_DMD',
        label: 'Conexión DMD',
        sourceKeys: ['CONEXION_DMD'],
        render: row => formatValue(row.CONEXION_DMD),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'DIFERENCIA',
        label: 'Diferencia',
        sourceKeys: ['DIFERENCIA'],
        render: row => formatValue(row.DIFERENCIA),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'HORAS_EXTRA_SEG',
        label: 'Horas Extra Seg',
        sourceKeys: ['HORAS_EXTRA_SEG'],
        render: row => formatValue(row.HORAS_EXTRA_SEG),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'HORAS DDD',
        label: 'Horas DDD',
        sourceKeys: ['HORAS DDD'],
        render: row => formatValue(row['HORAS DDD']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'HORAS_JORNADA_SEG',
        label: 'Horas Jornada Seg',
        sourceKeys: ['HORAS_JORNADA_SEG'],
        render: row => formatValue(row.HORAS_JORNADA_SEG),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'HORAS_DESCUENTO_SEG',
        label: 'Horas Descuento Seg',
        sourceKeys: ['HORAS_DESCUENTO_SEG'],
        render: row => formatValue(row.HORAS_DESCUENTO_SEG),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'SEPTIMO_PROPORCIONAL',
        label: 'Septimo Proporcional',
        sourceKeys: ['SEPTIMO_PROPORCIONAL'],
        render: row => formatValue(row.SEPTIMO_PROPORCIONAL),
        cellClassName: 'font-mono whitespace-nowrap',
    },
]

export const ConexionNetaOpe = () => {
    const { selectedUad } = useUadContext()
    const { dateRange } = useDateContext()
    const { data, dataGT, loading, loadingGT, error, fetchConexionNeta, fetchConexionNetaGT } =
        useConexionNetaOpe()
    const tableScrollRef = useRef<HTMLDivElement>(null)
    const [canScrollBack, setCanScrollBack] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)
    const isGtUad = selectedUad !== null && GT_UAD_IDS.has(selectedUad)

    const syncScrollControls = useCallback(() => {
        const container = tableScrollRef.current

        if (!container) {
            setCanScrollBack(false)
            setCanScrollNext(false)
            return
        }

        const maxScrollLeft = Math.max(container.scrollWidth - container.clientWidth, 0)

        setCanScrollBack(container.scrollLeft > 8)
        setCanScrollNext(maxScrollLeft - container.scrollLeft > 8)
    }, [])

    const scrollTable = useCallback((direction: 'back' | 'next') => {
        const container = tableScrollRef.current

        if (!container) {
            return
        }

        const scrollAmount = Math.max(Math.round(container.clientWidth * 0.82), 320)

        container.scrollBy({
            left: direction === 'next' ? scrollAmount : -scrollAmount,
            behavior: 'smooth',
        })
    }, [])

    useEffect(() => {
        if (selectedUad === null) {
            return
        }

        const params = {
            startDate: dateRange[0],
            endDate: dateRange[1],
            uadId: selectedUad,
        }

        if (isGtUad) {
            void fetchConexionNetaGT(params)
            return
        }

        void fetchConexionNeta(params)
    }, [dateRange, fetchConexionNeta, fetchConexionNetaGT, isGtUad, selectedUad])

    const activeRows = isGtUad ? dataGT : data
    const activeLoading = isGtUad ? loadingGT : loading

    const sortedRows = useMemo(() => {
        return [...activeRows].sort(sortRowsByRoster)
    }, [activeRows])

    const visibleColumns = useMemo(() => {
        if (sortedRows.length === 0) {
            return COLUMN_DEFINITIONS.filter(column => FALLBACK_COLUMN_IDS.includes(column.id))
        }

        return COLUMN_DEFINITIONS.filter(column =>
            column.sourceKeys.some(sourceKey => sortedRows.some(row => hasValue(row[sourceKey]))),
        )
    }, [sortedRows])

    const summary = useMemo(() => {
        const uniqueRosters = new Set(sortedRows.map(row => row.ROSTER)).size

        return {
            totalRows: sortedRows.length,
            uniqueRosters,
        }
    }, [sortedRows])

    useEffect(() => {
        const container = tableScrollRef.current

        syncScrollControls()

        if (!container) {
            return
        }

        const handleScroll = () => {
            syncScrollControls()
        }

        const handleResize = () => {
            syncScrollControls()
        }

        container.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleResize)

        const frameId = window.requestAnimationFrame(syncScrollControls)

        return () => {
            container.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleResize)
            window.cancelAnimationFrame(frameId)
        }
    }, [syncScrollControls, visibleColumns.length, sortedRows.length])

    return (
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between'>
                <div>
                    <CustomTitle text='Conexión Neta por Roster' size='text-2xl' />
                    <p className='text-slate-500 text-sm mt-1'>
                        Consulta operativa por UAD con columnas dinámicas según la respuesta del
                        endpoint.
                    </p>
                </div>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                    <CustomDatePicker />
                    <div className='min-w-[220px]'>
                        <UadList />
                    </div>
                </div>
            </div>

            <div className='bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-brand'>
                <div className='flex flex-col gap-3 border-b border-slate-200 bg-background-light px-6 py-4 lg:flex-row lg:items-center lg:justify-between'>
                    <div>
                        <p className='text-sm font-semibold text-charcoal'>Navegacion Horizontal</p>
                        <p className='text-xs text-slate-500'>
                            Usa los botones para avanzar o regresar entre columnas.
                        </p>
                    </div>
                    <div className='flex items-center gap-2 self-start lg:self-auto'>
                        <button
                            type='button'
                            onClick={() => scrollTable('back')}
                            disabled={!canScrollBack}
                            className='inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-cyan hover:text-teal disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400'
                        >
                            <span className='material-symbols-outlined text-base'>
                                chevron_left
                            </span>
                            Back
                        </button>
                        <button
                            type='button'
                            onClick={() => scrollTable('next')}
                            disabled={!canScrollNext}
                            className='inline-flex items-center gap-2 rounded-lg border border-primary-border bg-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400'
                        >
                            Next
                            <span className='material-symbols-outlined text-base'>
                                chevron_right
                            </span>
                        </button>
                    </div>
                </div>

                <div ref={tableScrollRef} className='overflow-x-auto'>
                    <table className='min-w-full text-left border-collapse'>
                        <thead>
                            <tr className='bg-background-light border-b border-slate-200'>
                                {visibleColumns.map(column => (
                                    <th
                                        key={column.id}
                                        className={`px-6 py-4 text-xs font-semibold text-charcoal uppercase tracking-[0.18em] whitespace-nowrap ${
                                            column.headerClassName ?? ''
                                        }`}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-slate-200'>
                            {activeLoading && (
                                <tr>
                                    <td
                                        colSpan={visibleColumns.length}
                                        className='px-6 py-16 text-center text-sm text-slate-500'
                                    >
                                        Cargando datos de conexión neta...
                                    </td>
                                </tr>
                            )}

                            {!activeLoading && error && (
                                <tr>
                                    <td
                                        colSpan={visibleColumns.length}
                                        className='px-6 py-16 text-center text-sm text-orange'
                                    >
                                        {error}
                                    </td>
                                </tr>
                            )}

                            {!activeLoading && !error && sortedRows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={visibleColumns.length}
                                        className='px-6 py-16 text-center text-sm text-slate-500'
                                    >
                                        {selectedUad === null
                                            ? 'Selecciona un UAD para consultar los datos.'
                                            : 'No se encontraron registros para los filtros seleccionados.'}
                                    </td>
                                </tr>
                            )}

                            {!activeLoading &&
                                !error &&
                                sortedRows.map((row, rowIndex) => (
                                    <tr
                                        key={`${row.ROSTER}-${row.FECHA}-${rowIndex}`}
                                        className='transition-colors hover:bg-background-light/60'
                                    >
                                        {visibleColumns.map(column => (
                                            <td
                                                key={`${column.id}-${rowIndex}`}
                                                className={`px-6 py-4 text-sm text-slate-600 align-middle ${
                                                    column.cellClassName ?? ''
                                                }`}
                                            >
                                                {column.render(row)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                <div className='px-6 py-4 bg-background-light border-t border-slate-200 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                    <p className='text-sm text-slate-600'>
                        Mostrando{' '}
                        <span className='font-semibold text-charcoal'>{summary.totalRows}</span>{' '}
                        registros de{' '}
                        <span className='font-semibold text-charcoal'>{summary.uniqueRosters}</span>{' '}
                        rosters
                    </p>
                </div>
            </div>

            <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='rounded-2xl border border-cyan bg-background-light p-6 shadow-sm'>
                    <div className='flex items-center gap-3 mb-3'>
                        <span className='material-symbols-outlined text-cyan'>dashboard</span>
                        <h3 className='font-semibold text-charcoal'>Columnas Dinámicas</h3>
                    </div>
                    <p className='text-sm text-slate-600 leading-relaxed'>
                        Las columnas se muestran únicamente cuando el endpoint retorna datos para
                        ellas. Las columnas vacías se ocultan automáticamente.
                    </p>
                </div>

                <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
                    <h3 className='font-semibold text-charcoal mb-4'>Consulta Actual</h3>
                    <div className='space-y-3 text-sm text-slate-600'>
                        <p>
                            <span className='font-semibold text-charcoal'>UAD:</span>{' '}
                            {selectedUad ?? '--'}
                        </p>
                        <p>
                            <span className='font-semibold text-charcoal'>Desde:</span>{' '}
                            {dateRange[0] || '--'}
                        </p>
                        <p>
                            <span className='font-semibold text-charcoal'>Hasta:</span>{' '}
                            {dateRange[1] || '--'}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
