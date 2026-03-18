'use client'

import { UadList } from '@/components/catalogs/UadList'
import { CustomTitle } from '@/components/UI/Custom/CustomTitle'
import { CustomDatePicker } from '@/components/UI/DateTimePicker'
import { useDateContext } from '@/context/UI/DateContext'
import { useUadContext } from '@/context/uad/UadContext'
import { useConexionNetaOpe } from '@/hooks/conexionNeta/UseConexionNetaOpe'
import type { ConexionNetaOpeRow } from '@/components/reports/operaciones/interfaces/ConexionNetaOpeRow.interface'
import { GT_UAD_IDS } from '@/constants/uads'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type RowKey = keyof ConexionNetaOpeRow

type TableColumn = {
    id: string
    label: string
    sourceKeys: RowKey[]
    render: (row: ConexionNetaOpeRow) => ReactNode
    headerClassName?: string
    cellClassName?: string
}

const FALLBACK_COLUMN_IDS = ['Codigo_Agente', 'Nombre_Agente', 'Fecha', 'Horario', 'Conexion_neta']
function hasValue(value: unknown) {
    return value !== null && value !== undefined && String(value).trim() !== ''
}

function parseNumericValue(value: unknown) {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0
    }

    if (typeof value !== 'string') {
        return 0
    }

    const normalizedValue = value.replace(/,/g, '').trim()
    const parsedValue = Number(normalizedValue)

    return Number.isFinite(parsedValue) ? parsedValue : 0
}

function formatNumericValue(value: unknown) {
    if (!hasValue(value)) {
        return '--'
    }

    const parsedValue = parseNumericValue(value)

    if (parsedValue !== 0 || String(value).trim() === '0' || String(value).trim() === '0.00') {
        return parsedValue.toFixed(2)
    }

    return String(value)
}

function formatDateValue(value: string) {
    if (!hasValue(value)) {
        return '--'
    }

    const isoDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/)

    if (isoDateMatch) {
        const [, year, month, day] = isoDateMatch
        return `${day}/${month}/${year}`
    }

    const parsedDate = new Date(value)

    if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString('es-GT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    return value
}

function formatTimeValue(value: string | null | undefined) {
    if (!hasValue(value)) {
        return '--'
    }

    const timeMatch = String(value).match(/(?:T|\s)?(\d{2}):(\d{2})/)

    if (timeMatch) {
        return `${timeMatch[1]}:${timeMatch[2]}`
    }

    const parsedDate = new Date(String(value))

    if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleTimeString('es-GT', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
    }

    return String(value)
}

function formatSchedule(fromTime: string | null, toTime: string | null) {
    if (!hasValue(fromTime) && !hasValue(toTime)) {
        return '--'
    }

    return `${formatTimeValue(fromTime)} - ${formatTimeValue(toTime)}`
}

function sortRowsByRosterAndDate(leftRow: ConexionNetaOpeRow, rightRow: ConexionNetaOpeRow) {
    const rosterDifference = Number(leftRow.Codigo_Agente) - Number(rightRow.Codigo_Agente)

    if (rosterDifference !== 0) {
        return rosterDifference
    }

    const leftDate = new Date(leftRow.Fecha).getTime()
    const rightDate = new Date(rightRow.Fecha).getTime()

    if (!Number.isNaN(leftDate) && !Number.isNaN(rightDate)) {
        return leftDate - rightDate
    }

    return String(leftRow.Fecha).localeCompare(String(rightRow.Fecha))
}

function shouldMergeWeeklyTotal(
    currentRow: ConexionNetaOpeRow,
    nextRow: ConexionNetaOpeRow | undefined,
) {
    if (!nextRow) {
        return false
    }

    return (
        currentRow.Codigo_Agente === nextRow.Codigo_Agente &&
        currentRow.Conexion_Neta_Semana === nextRow.Conexion_Neta_Semana
    )
}

const COLUMN_DEFINITIONS: TableColumn[] = [
    {
        id: 'Codigo_Agente',
        label: 'Roster',
        sourceKeys: ['Codigo_Agente'],
        render: row => row.Codigo_Agente,
        cellClassName: 'font-semibold text-charcoal whitespace-nowrap',
    },
    {
        id: 'Nombre_Agente',
        label: 'Nombre',
        sourceKeys: ['Nombre_Agente'],
        render: row => row.Nombre_Agente,
        cellClassName: 'min-w-[220px]',
    },
    {
        id: 'Fecha',
        label: 'Fecha',
        sourceKeys: ['Fecha'],
        render: row => formatDateValue(row.Fecha),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'Asistencia_Planificacion',
        label: 'Nomenclatura',
        sourceKeys: ['Asistencia_Planificacion'],
        render: row => row.Asistencia_Planificacion || '--',
        cellClassName: 'text-center',
    },
    {
        id: 'Horario',
        label: 'Horario',
        sourceKeys: ['From_Time_Planning', 'To_Time_Planning'],
        render: row => formatSchedule(row.From_Time_Planning, row.To_Time_Planning),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'Planificacion_Diaria',
        label: 'Planned',
        sourceKeys: ['Planificacion_Diaria'],
        render: row => row.Planificacion_Diaria || '--',
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'Posicion_Agente',
        label: 'Posicion Agente',
        sourceKeys: ['Posicion_Agente'],
        render: row => row.Posicion_Agente || '--',
    },
    {
        id: 'Supervisor',
        label: 'Posicion Sup',
        sourceKeys: ['Supervisor'],
        render: row => row.Supervisor || '--',
    },
    {
        id: 'Hrs_WP',
        label: 'WP Hours',
        sourceKeys: ['Hrs_WP'],
        render: row => formatNumericValue(row.Hrs_WP),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Hrs_Ley',
        label: 'Law Hours',
        sourceKeys: ['Hrs_Ley'],
        render: row => formatNumericValue(row.Hrs_Ley),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Calculated_Law_Hours',
        label: 'Calculated Law Hours',
        sourceKeys: ['Calculated_Law_Hours'],
        render: row => formatNumericValue(row.Calculated_Law_Hours),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Login',
        label: 'Login AMD',
        sourceKeys: ['Login'],
        render: row => formatTimeValue(row.Login),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Logout',
        label: 'Logout AMD',
        sourceKeys: ['Logout'],
        render: row => formatTimeValue(row.Logout),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Login_wp',
        label: 'Login DMD',
        sourceKeys: ['Login_wp'],
        render: row => formatTimeValue(row.Login_wp),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Logout_wp',
        label: 'Logout DMD',
        sourceKeys: ['Logout_wp'],
        render: row => formatTimeValue(row.Logout_wp),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Staffed_Time',
        label: 'Staffed Time Horas',
        sourceKeys: ['Staffed_Time'],
        render: row => formatNumericValue(row.Staffed_Time),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Missing_Time',
        label: 'Missing Time Horas',
        sourceKeys: ['Missing_Time'],
        render: row => formatNumericValue(row.Missing_Time),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'WP_Total',
        label: 'WP Total',
        sourceKeys: ['WP_Total'],
        render: row => formatNumericValue(row.WP_Total),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Vto',
        label: 'VTO',
        sourceKeys: ['Vto'],
        render: row => formatNumericValue(row.Vto),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Total',
        label: 'Total',
        sourceKeys: ['Total'],
        render: row => formatNumericValue(row.Total),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Asistencia',
        label: 'Asistencia',
        sourceKeys: ['Asistencia'],
        render: row => row.Asistencia || '--',
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'WP',
        label: 'Pase',
        sourceKeys: ['WP'],
        render: row => row.WP || '--',
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'Final',
        label: 'Final',
        sourceKeys: ['Final'],
        render: row => row.Final || '--',
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'Conexion_neta',
        label: 'Conexión Neta',
        sourceKeys: ['Conexion_neta'],
        render: row => formatNumericValue(row.Conexion_neta),
        cellClassName: 'font-mono whitespace-nowrap text-teal font-semibold',
    },
    {
        id: 'Conexion_neta_calculada',
        label: 'Conexión Neta Calc',
        sourceKeys: ['Conexion_neta_calculada'],
        render: row => formatNumericValue(row.Conexion_neta_calculada),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Conexion_AMD',
        label: 'Conexión AMD',
        sourceKeys: ['Conexion_AMD'],
        render: row => formatNumericValue(row.Conexion_AMD),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Conexion_DMD',
        label: 'Conexión DMD',
        sourceKeys: ['Conexion_DMD'],
        render: row => formatNumericValue(row.Conexion_DMD),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Diferencia',
        label: 'Diferencia',
        sourceKeys: ['Diferencia'],
        render: row => formatNumericValue(row.Diferencia),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Horas_Extra',
        label: 'Horas Extra Seg',
        sourceKeys: ['Horas_Extra'],
        render: row => formatNumericValue(row.Horas_Extra),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Horas_DDD',
        label: 'Horas DDD',
        sourceKeys: ['Horas_DDD'],
        render: row => formatNumericValue(row.Horas_DDD),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'Horas_Jornada',
        label: 'Horas Jornada Seg',
        sourceKeys: ['Horas_Jornada'],
        render: row => formatNumericValue(row.Horas_Jornada),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'horas_descuento',
        label: 'Horas Descuento Seg',
        sourceKeys: ['horas_descuento'],
        render: row => formatNumericValue(row.horas_descuento),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'septimo_proporcional',
        label: 'Septimo Proporcional',
        sourceKeys: ['septimo_proporcional'],
        render: row => formatNumericValue(row.septimo_proporcional),
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
        return [...activeRows].sort(sortRowsByRosterAndDate)
    }, [activeRows])

    const visibleColumns = useMemo(() => {
        if (sortedRows.length === 0) {
            return COLUMN_DEFINITIONS.filter(column => FALLBACK_COLUMN_IDS.includes(column.id))
        }

        return COLUMN_DEFINITIONS.filter(column =>
            column.sourceKeys.some(sourceKey => sortedRows.some(row => hasValue(row[sourceKey]))),
        )
    }, [sortedRows])

    const weeklyCellRowSpanByIndex = useMemo(() => {
        const rowSpanMap = new Map<number, number>()

        for (let rowIndex = 0; rowIndex < sortedRows.length; rowIndex += 1) {
            let rowSpan = 1

            while (
                shouldMergeWeeklyTotal(
                    sortedRows[rowIndex + rowSpan - 1],
                    sortedRows[rowIndex + rowSpan],
                )
            ) {
                rowSpan += 1
            }

            rowSpanMap.set(rowIndex, rowSpan)
            rowIndex += rowSpan - 1
        }

        return rowSpanMap
    }, [sortedRows])

    const summary = useMemo(() => {
        const uniqueRosters = new Set(sortedRows.map(row => row.Codigo_Agente)).size
        const totalConexionNeta = sortedRows.reduce(
            (total, row) => total + parseNumericValue(row.Conexion_neta),
            0,
        )

        const totalWeeklyHours = Array.from(weeklyCellRowSpanByIndex.keys()).reduce(
            (total, rowIndex) =>
                total + parseNumericValue(sortedRows[rowIndex]?.Conexion_Neta_Semana),
            0,
        )

        return {
            totalRows: sortedRows.length,
            uniqueRosters,
            totalConexionNeta,
            totalWeeklyHours,
        }
    }, [sortedRows, weeklyCellRowSpanByIndex])

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

    const totalColumnCount = visibleColumns.length + 1

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
                                <th className='px-6 py-4 text-xs font-semibold text-teal uppercase tracking-[0.18em] whitespace-nowrap text-center border-l border-primary-border'>
                                    Conexión Neta Semanal
                                </th>
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-slate-200'>
                            {activeLoading && (
                                <tr>
                                    <td
                                        colSpan={totalColumnCount}
                                        className='px-6 py-16 text-center text-sm text-slate-500'
                                    >
                                        Cargando datos de conexión neta...
                                    </td>
                                </tr>
                            )}

                            {!activeLoading && error && (
                                <tr>
                                    <td
                                        colSpan={totalColumnCount}
                                        className='px-6 py-16 text-center text-sm text-orange'
                                    >
                                        {error}
                                    </td>
                                </tr>
                            )}

                            {!activeLoading && !error && sortedRows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={totalColumnCount}
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
                                        key={`${row.Codigo_Agente}-${row.Fecha}-${rowIndex}`}
                                        className='transition-colors hover:codg-background-light/60'
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

                                        {weeklyCellRowSpanByIndex.has(rowIndex) && (
                                            <td
                                                rowSpan={weeklyCellRowSpanByIndex.get(rowIndex)}
                                                className='min-w-[220px] border-l border-primary-border bg-background-light align-middle'
                                            >
                                                <div className='flex min-h-[180px] flex-col items-center justify-center px-6 py-10 text-center'>
                                                    <span className='text-4xl font-bold text-teal font-display'>
                                                        {formatNumericValue(
                                                            row.Conexion_Neta_Semana,
                                                        )}
                                                    </span>
                                                    <span className='mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange'>
                                                        Total Horas
                                                    </span>
                                                </div>
                                            </td>
                                        )}
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
                    <div className='flex flex-col gap-1 text-sm text-slate-600 sm:flex-row sm:items-center sm:gap-6'>
                        <span>
                            Conexión Neta total:{' '}
                            <strong className='text-teal'>
                                {formatNumericValue(summary.totalConexionNeta)}
                            </strong>
                        </span>
                        <span>
                            Total semanal acumulado:{' '}
                            <strong className='text-orange'>
                                {formatNumericValue(summary.totalWeeklyHours)}
                            </strong>
                        </span>
                    </div>
                </div>
            </div>

            <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='rounded-2xl border border-cyan bg-background-light p-6 shadow-sm'>
                    <div className='flex items-center gap-3 mb-3'>
                        <span className='material-symbols-outlined text-cyan'>dashboard</span>
                        <h3 className='font-semibold text-charcoal'>Resumen Semanal</h3>
                    </div>
                    <p className='text-sm text-slate-600 leading-relaxed'>
                        Las celdas de la última columna se agrupan por roster para mostrar una sola
                        vez el total de conexión neta semanal cuando el valor es el mismo.
                    </p>
                </div>

                <div className='rounded-2xl border border-primary-border bg-white p-6 shadow-sm'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='font-semibold text-charcoal'>Horas Semanales</h3>
                        <span className='text-xs font-semibold uppercase tracking-[0.18em] text-orange'>
                            Acumulado
                        </span>
                    </div>
                    <span className='block text-4xl font-bold text-teal font-display'>
                        {formatNumericValue(summary.totalWeeklyHours)}
                    </span>
                    <p className='mt-2 text-sm text-slate-500'>
                        Suma de los totales únicos de conexión neta semanal por roster.
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
                            {formatDateValue(dateRange[0])}
                        </p>
                        <p>
                            <span className='font-semibold text-charcoal'>Hasta:</span>{' '}
                            {formatDateValue(dateRange[1])}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
