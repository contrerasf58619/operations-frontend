'use client'

import { UadList } from '@/components/catalogs/UadList'
import { CustomTitle } from '@/components/UI/Custom/CustomTitle'
import { CustomDatePicker } from '@/components/UI/DateTimePicker'
import { useDateContext } from '@/context/UI/DateContext'
import { useUadContext } from '@/context/uad/UadContext'
import { useConexionNetaOpe } from '@/hooks/conexionNeta/UseConexionNetaOpe'
import type { ConexionNetaOpeDatum } from '@/components/reports/operaciones/interfaces/ConexionNetaOpeRow.interface'
import { GT_UAD_IDS } from '@/constants/uads'
import { useEffect, useMemo, useState } from 'react'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { COLUMN_DEFINITIONS } from './utils/columns-cno'

const ROWS_PER_PAGE = 5

const FALLBACK_COLUMN_IDS = ['ROSTER', 'NOMBRE', 'FECHA', 'HORARIO', 'CONEXION_NETA']

function hasValue(value: unknown) {
    return value !== null && value !== undefined && String(value).trim() !== ''
}

function sortRowsByRoster(leftRow: ConexionNetaOpeDatum, rightRow: ConexionNetaOpeDatum) {
    return Number(leftRow.ROSTER) - Number(rightRow.ROSTER)
}

const baseBtn =
    'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1'

const primaryBtn =
    'bg-orange-500 text-white border border-orange-500 hover:bg-orange-600 hover:border-orange-600 active:scale-[0.98]'

const secondaryBtn =
    'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98]'

const disabledBtn =
    'cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-100 hover:border-slate-200 active:scale-100'

export const ConexionNetaOpe = () => {
    const { selectedUad } = useUadContext()
    const { dateRange } = useDateContext()
    const { data, dataGT, loading, loadingGT, error, fetchConexionNeta, fetchConexionNetaGT } =
        useConexionNetaOpe()
    const [currentPage, setCurrentPage] = useState(1)
    const isGtUad = selectedUad !== null && GT_UAD_IDS.has(selectedUad)

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

    const totalPages = Math.max(1, Math.ceil(sortedRows.length / ROWS_PER_PAGE))

    // Reset to page 1 whenever the dataset changes
    useEffect(() => {
        setCurrentPage(1)
    }, [sortedRows])

    const pagedRows = useMemo(() => {
        const start = (currentPage - 1) * ROWS_PER_PAGE
        return sortedRows.slice(start, start + ROWS_PER_PAGE)
    }, [sortedRows, currentPage])

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
        const pageStart = (currentPage - 1) * ROWS_PER_PAGE + 1
        const pageEnd = Math.min(currentPage * ROWS_PER_PAGE, sortedRows.length)

        return {
            totalRows: sortedRows.length,
            uniqueRosters,
            pageStart: sortedRows.length === 0 ? 0 : pageStart,
            pageEnd,
        }
    }, [sortedRows, currentPage])

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
                <div className='overflow-x-auto'>
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
                                pagedRows.map((row, rowIndex) => (
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

                <div className='px-6 py-3 bg-background-light border-t border-slate-200'>
                    <p className='text-sm text-slate-600'>
                        Mostrando{' '}
                        <span className='font-semibold text-charcoal'>{summary.pageStart}</span>
                        {' – '}
                        <span className='font-semibold text-charcoal'>{summary.pageEnd}</span>
                        {' de '}
                        <span className='font-semibold text-charcoal'>
                            {summary.totalRows}
                        </span>{' '}
                        registros &nbsp;·&nbsp;{' '}
                        <span className='font-semibold text-charcoal'>{summary.uniqueRosters}</span>{' '}
                        rosters
                    </p>
                </div>

                <div
                    id='navigation-horizontal'
                    className='flex flex-col gap-3 border-t border-slate-200 bg-background-light px-6 py-4 lg:flex-row lg:items-center lg:justify-between'
                >
                    <p className='text-xs text-slate-500'>
                        Página <span className='font-semibold text-charcoal'>{currentPage}</span>
                        {' de '}
                        <span className='font-semibold text-charcoal'>{totalPages}</span>
                    </p>

                    <div className='flex items-center gap-2 self-start lg:self-auto'>
                        <button
                            type='button'
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            className={`${baseBtn} ${
                                currentPage <= 1 ? disabledBtn : secondaryBtn
                            }`}
                        >
                            <MdChevronLeft size={18} />
                            Back
                        </button>

                        <button
                            type='button'
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                            className={`${baseBtn} ${
                                currentPage >= totalPages ? disabledBtn : primaryBtn
                            }`}
                        >
                            Next
                            <MdChevronRight size={18} />
                        </button>
                    </div>
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
