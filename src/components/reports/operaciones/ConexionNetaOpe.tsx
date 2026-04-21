'use client'

import { UadList } from '@/components/catalogs/UadList'
import { CustomTitle } from '@/components/UI/Custom/CustomTitle'
import { CustomDatePicker } from '@/components/UI/DateTimePicker'
import { useDateContext } from '@/context/UI/DateContext'
import { useConexionNetaOpe } from '@/hooks/conexionNeta/UseConexionNetaOpe'
import type { DatumWild } from '@/components/reports/operaciones/interfaces/ConexionNetaOpeRow.interface'
import { GT_UAD_IDS } from '@/constants/uads'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MdChevronLeft, MdChevronRight, MdViewColumn } from 'react-icons/md'
import { COLUMN_DEFINITIONS } from './utils/columns-cno'
import { TableSkeleton } from './TableSkeleton'
import { MdSearch, MdClose } from 'react-icons/md'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const

const FALLBACK_COLUMN_IDS = ['ROSTER', 'NOMBRE', 'FECHA', 'HORARIO', 'NOMENCLATURA', 'FINAL']

const ALL_COLUMN_IDS = COLUMN_DEFINITIONS.map(column => column.id)

const VISIBLE_COLUMNS_STORAGE_KEY = 'conexion-neta-ope:visible-columns'

const GROUPED_COLUMN_IDS = new Set<keyof DatumWild>([
    'WP_HOURS',
    'LAW_HOURS',
    'CALCULATED_LAW_HOURS',
    'HORAS_EXTRA_SEG',
])

type CellMeta = { render: boolean; rowspan: number }

function computeGroupMeta(rows: DatumWild[], columnId: keyof DatumWild): CellMeta[] {
    const meta: CellMeta[] = rows.map(() => ({ render: true, rowspan: 1 }))

    for (let i = rows.length - 1; i > 0; i--) {
        const sameRoster = rows[i].ROSTER === rows[i - 1].ROSTER
        const sameValue = String(rows[i][columnId]) === String(rows[i - 1][columnId])

        if (sameRoster && sameValue) {
            meta[i].render = false
            meta[i - 1].rowspan += meta[i].rowspan
        }
    }

    return meta
}

function sortRowsByRoster(leftRow: DatumWild, rightRow: DatumWild) {
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
    // const { selectedUad } = useUadContext()
    const { dateRange } = useDateContext()
    const { data, dataGT, loading, loadingGT, error, fetchConexionNeta, fetchConexionNetaGT } =
        useConexionNetaOpe()
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUad, setSelectedUad] = useState<number>(0)
    const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(FALLBACK_COLUMN_IDS)
    const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false)
    const columnSelectorRef = useRef<HTMLDivElement>(null)
    const isGtUad = selectedUad !== null && GT_UAD_IDS.has(selectedUad)

    useEffect(() => {
        try {
            const raw = localStorage.getItem(VISIBLE_COLUMNS_STORAGE_KEY)
            if (!raw) return
            const parsed: unknown = JSON.parse(raw)
            if (!Array.isArray(parsed)) return
            const sanitized = parsed.filter(
                (id): id is string => typeof id === 'string' && ALL_COLUMN_IDS.includes(id),
            )
            if (sanitized.length > 0) {
                setVisibleColumnIds(sanitized)
            }
        } catch {
            // ignore unreadable/corrupt storage
        }
    }, [])

    useEffect(() => {
        try {
            localStorage.setItem(
                VISIBLE_COLUMNS_STORAGE_KEY,
                JSON.stringify(visibleColumnIds),
            )
        } catch {
            // ignore quota / disabled storage
        }
    }, [visibleColumnIds])

    useEffect(() => {
        if (!isColumnSelectorOpen) return
        const handleClickOutside = (event: MouseEvent) => {
            if (
                columnSelectorRef.current &&
                !columnSelectorRef.current.contains(event.target as Node)
            ) {
                setIsColumnSelectorOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isColumnSelectorOpen])

    const toggleColumn = useCallback((columnId: string, checked: boolean) => {
        setVisibleColumnIds(prev => {
            if (checked) {
                if (prev.includes(columnId)) return prev
                const next = new Set([...prev, columnId])
                return ALL_COLUMN_IDS.filter(id => next.has(id))
            }
            if (prev.length <= 1) return prev
            return prev.filter(id => id !== columnId)
        })
    }, [])

    const handleSelectAllColumns = useCallback(() => {
        setVisibleColumnIds(ALL_COLUMN_IDS)
    }, [])

    const handleResetColumns = useCallback(() => {
        setVisibleColumnIds(FALLBACK_COLUMN_IDS)
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

    const filteredRows = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return sortedRows
        return sortedRows.filter(
            row =>
                String(row.ROSTER).toLowerCase().includes(q) ||
                row.NOMBRE.toLowerCase().includes(q),
        )
    }, [sortedRows, searchQuery])

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage))

    // Reset to page 1
    useEffect(() => {
        setCurrentPage(1)
    }, [filteredRows, rowsPerPage])

    const pagedRows = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage
        return filteredRows.slice(start, start + rowsPerPage)
    }, [filteredRows, currentPage, rowsPerPage])

    const groupMeta = useMemo(() => {
        const map = new Map<keyof DatumWild, CellMeta[]>()
        for (const colId of GROUPED_COLUMN_IDS) {
            map.set(colId, computeGroupMeta(pagedRows, colId))
        }
        return map
    }, [pagedRows])

    const visibleColumns = useMemo(() => {
        const selected = new Set(visibleColumnIds)
        return COLUMN_DEFINITIONS.filter(column => selected.has(column.id))
    }, [visibleColumnIds])

    const summary = useMemo(() => {
        const uniqueRosters = new Set(filteredRows.map(row => row.ROSTER)).size
        const pageStart = (currentPage - 1) * rowsPerPage + 1
        const pageEnd = Math.min(currentPage * rowsPerPage, filteredRows.length)

        return {
            totalRows: filteredRows.length,
            uniqueRosters,
            pageStart: filteredRows.length === 0 ? 0 : pageStart,
            pageEnd,
        }
    }, [filteredRows, currentPage, rowsPerPage])

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
                    <div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                        <CustomDatePicker />
                    </div>
                    <div className='bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                        <label
                            htmlFor='uad'
                            className='block text-sm font-semibold text-gray-900 mb-4'
                        >
                            UAD
                        </label>
                        <div className='space-y-4'>
                            <UadList
                                value={selectedUad}
                                onChange={v => setSelectedUad(Number(v))}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex flex-1 items-center gap-2'>
                    <div className='relative flex-1 max-w-sm'>
                        <MdSearch
                            size={18}
                            className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'
                        />
                        <input
                            type='text'
                            placeholder='Buscar por roster o nombre...'
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className='w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-charcoal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan focus:border-cyan transition-colors'
                        />
                        {searchQuery && (
                            <button
                                type='button'
                                onClick={() => setSearchQuery('')}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
                                aria-label='Limpiar búsqueda'
                            >
                                <MdClose size={16} />
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className='text-sm text-slate-500 whitespace-nowrap'>
                            <span className='font-semibold text-charcoal'>
                                {filteredRows.length}
                            </span>
                            {' de '}
                            <span className='font-semibold text-charcoal'>
                                {sortedRows.length}
                            </span>
                            {' resultados'}
                        </p>
                    )}
                </div>

                <div className='relative self-end sm:self-auto' ref={columnSelectorRef}>
                    <button
                        type='button'
                        onClick={() => setIsColumnSelectorOpen(open => !open)}
                        aria-haspopup='menu'
                        aria-expanded={isColumnSelectorOpen}
                        className={`${baseBtn} ${secondaryBtn}`}
                    >
                        <MdViewColumn size={18} />
                        Seleccionar columnas
                        <span className='ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600'>
                            {visibleColumnIds.length}/{ALL_COLUMN_IDS.length}
                        </span>
                    </button>

                    {isColumnSelectorOpen && (
                        <div
                            role='menu'
                            className='absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-xl border border-slate-200 bg-white shadow-xl'
                        >
                            <div className='flex items-center justify-between border-b border-slate-200 px-4 py-3'>
                                <span className='text-sm font-semibold text-charcoal'>
                                    Columnas visibles
                                </span>
                                <div className='flex gap-3 text-xs font-semibold'>
                                    <button
                                        type='button'
                                        onClick={handleSelectAllColumns}
                                        className='text-orange-600 hover:text-orange-700'
                                    >
                                        Todas
                                    </button>
                                    <button
                                        type='button'
                                        onClick={handleResetColumns}
                                        className='text-slate-500 hover:text-slate-700'
                                    >
                                        Por defecto
                                    </button>
                                </div>
                            </div>
                            <ul className='max-h-80 overflow-y-auto py-1'>
                                {COLUMN_DEFINITIONS.map(column => {
                                    const checked = visibleColumnIds.includes(column.id)
                                    const isOnlySelected =
                                        checked && visibleColumnIds.length === 1
                                    return (
                                        <li key={column.id}>
                                            <label
                                                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-slate-50 ${
                                                    isOnlySelected
                                                        ? 'cursor-not-allowed opacity-60'
                                                        : 'cursor-pointer'
                                                }`}
                                                title={
                                                    isOnlySelected
                                                        ? 'Debe permanecer al menos una columna visible'
                                                        : undefined
                                                }
                                            >
                                                <input
                                                    type='checkbox'
                                                    checked={checked}
                                                    disabled={isOnlySelected}
                                                    onChange={e =>
                                                        toggleColumn(column.id, e.target.checked)
                                                    }
                                                    className='h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500'
                                                />
                                                <span className='text-slate-700'>
                                                    {column.label}
                                                </span>
                                            </label>
                                        </li>
                                    )
                                })}
                            </ul>
                            <div className='border-t border-slate-200 bg-background-light px-4 py-2 text-xs text-slate-500'>
                                {visibleColumnIds.length} de {ALL_COLUMN_IDS.length} seleccionadas
                            </div>
                        </div>
                    )}
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
                            {activeLoading && <TableSkeleton columns={visibleColumns.length} />}

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

                            {!activeLoading && !error && filteredRows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={visibleColumns.length}
                                        className='px-6 py-16 text-center text-sm text-slate-500'
                                    >
                                        {selectedUad === null
                                            ? 'Selecciona un UAD para consultar los datos.'
                                            : searchQuery
                                              ? `Sin resultados para "${searchQuery}".`
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
                                        {visibleColumns.map(column => {
                                            const colId = column.id as keyof DatumWild

                                            if (GROUPED_COLUMN_IDS.has(colId)) {
                                                const meta = groupMeta.get(colId)?.[rowIndex]

                                                if (!meta?.render) return null

                                                return (
                                                    <td
                                                        key={`${column.id}-${rowIndex}`}
                                                        rowSpan={meta.rowspan}
                                                        className={`px-6 py-4 text-sm text-slate-600 align-middle ${
                                                            column.cellClassName ?? ''
                                                        } ${
                                                            meta.rowspan > 1
                                                                ? 'border-l border-r border-slate-100 bg-slate-50/40'
                                                                : ''
                                                        }`}
                                                    >
                                                        {column.render(row)}
                                                    </td>
                                                )
                                            }

                                            return (
                                                <td
                                                    key={`${column.id}-${rowIndex}`}
                                                    className={`px-6 py-4 text-sm text-slate-600 align-middle ${
                                                        column.cellClassName ?? ''
                                                    }`}
                                                >
                                                    {column.render(row)}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                <div className='flex flex-col gap-3 px-6 py-3 bg-background-light border-t border-slate-200 sm:flex-row sm:items-center sm:justify-between'>
                    <p className='text-sm text-slate-600'>
                        Mostrando{' '}
                        <span className='font-semibold text-charcoal'>{summary.pageStart}</span>
                        {' – '}
                        <span className='font-semibold text-charcoal'>{summary.pageEnd}</span>
                        {' de '}
                        <span className='font-semibold text-charcoal'>{summary.totalRows}</span>
                        {' registros \u00a0·\u00a0 '}
                        <span className='font-semibold text-charcoal'>{summary.uniqueRosters}</span>
                        {' rosters'}
                    </p>

                    <label className='flex items-center gap-2 text-sm text-slate-600 whitespace-nowrap'>
                        Filas por página
                        <select
                            value={rowsPerPage}
                            onChange={e =>
                                setRowsPerPage(
                                    Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number],
                                )
                            }
                            className='rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-cyan'
                        >
                            {PAGE_SIZE_OPTIONS.map(size => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </label>
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
                        <h3 className='font-semibold text-charcoal'>Columnas Personalizables</h3>
                    </div>
                    <p className='text-sm text-slate-600 leading-relaxed'>
                        Usa el botón <span className='font-semibold'>Seleccionar columnas</span>{' '}
                        para mostrar u ocultar columnas. Tu selección se guarda en el navegador y
                        se mantiene en próximas visitas.
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
