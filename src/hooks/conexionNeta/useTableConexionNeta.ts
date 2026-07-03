'use client'

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type Dispatch,
    type RefObject,
    type SetStateAction,
} from 'react'
import type { DatumGT } from '@/components/reports/operaciones/interfaces/ConexionNetaOpeRow.interface'
import type { TableColumn } from '@/components/reports/operaciones/utils/columns-cno'
import type { ConexionNetaReportType } from '@/constants/uads'

export type { TableColumn }

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]

export const FALLBACK_COLUMN_IDS: string[] = [
    'ROSTER',
    'NOMBRE',
    'FECHA',
    'HORARIO',
    // 'NOMENCLATURA',
    // 'FINAL',
    // 'PORCENTAJE_CONEXION',
]

// Every grouped id is part of the shared base column set, so the same set
// applies to the GT, HN and COL column definitions alike.
export const GROUPED_COLUMN_IDS = new Set<keyof DatumGT>([
    'WP_HOURS',
    'LAW_HOURS',
    'CALCULATED_LAW_HOURS',
    'HORAS_EXTRA_SEG',
    'SEPTIMO_PROPORCIONAL',
    'PORCENTAJE_CONEXION',
    'HORAS_DESCUENTO_SEG',
    'HORAS_JORNADA_SEG',
    'CONEXION_NETA_CALCULADA_WEEKLY',
])

// Saved column selections are namespaced per report type because each type
// has a different column set. The legacy un-namespaced key predates the
// namespacing and is read once as a fallback so existing selections carry
// over instead of silently resetting.
const VISIBLE_COLUMNS_STORAGE_KEY_PREFIX = 'conexion-neta-ope:visible-columns'
const LEGACY_VISIBLE_COLUMNS_STORAGE_KEY = 'conexion-neta-ope:visible-columns'

function readStoredColumnIds(storageKey: string, validIds: string[]): string[] | null {
    try {
        const raw =
            localStorage.getItem(storageKey) ??
            localStorage.getItem(LEGACY_VISIBLE_COLUMNS_STORAGE_KEY)
        if (!raw) return null
        const parsed: unknown = JSON.parse(raw)
        if (!Array.isArray(parsed)) return null
        const sanitized = parsed.filter(
            (id): id is string => typeof id === 'string' && validIds.includes(id),
        )
        return sanitized.length > 0 ? sanitized : null
    } catch {
        // ignore unreadable/corrupt storage
        return null
    }
}

export type CellMeta = { render: boolean; rowspan: number }

export interface TableSummary {
    totalRows: number
    uniqueRosters: number
    pageStart: number
    pageEnd: number
}

export interface ColumnSelectorItem {
    column: TableColumn
    checked: boolean
    isOnlySelected: boolean
}

export interface ColumnSelectorAPI {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    containerRef: RefObject<HTMLDivElement | null>
    items: ColumnSelectorItem[]
    visibleCount: number
    totalCount: number
    toggle: (columnId: string, checked: boolean) => void
    selectAll: () => void
    reset: () => void
}

export interface UseTableConexionNetaReturn<Row extends DatumGT> {
    searchQuery: string
    setSearchQuery: Dispatch<SetStateAction<string>>
    currentPage: number
    setCurrentPage: Dispatch<SetStateAction<number>>
    rowsPerPage: PageSize
    setRowsPerPage: Dispatch<SetStateAction<PageSize>>
    totalPages: number
    sortedRows: Row[]
    filteredRows: Row[]
    pagedRows: Row[]
    visibleColumns: TableColumn[]
    groupMeta: Map<keyof DatumGT, CellMeta[]>
    isGroupedColumn: (columnId: string) => boolean
    summary: TableSummary
    columnSelector: ColumnSelectorAPI
}

function computeGroupMeta<Row extends DatumGT>(rows: Row[], columnId: keyof DatumGT): CellMeta[] {
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

function sortRowsByRoster(leftRow: DatumGT, rightRow: DatumGT) {
    return Number(leftRow.ROSTER) - Number(rightRow.ROSTER)
}

export function useTableConexionNeta<Row extends DatumGT>(
    rows: Row[],
    columns: TableColumn[],
    reportType: ConexionNetaReportType,
): UseTableConexionNetaReturn<Row> {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState<PageSize>(5)
    const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(FALLBACK_COLUMN_IDS)
    const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false)
    const columnSelectorRef = useRef<HTMLDivElement>(null)
    const hydratedStorageKeyRef = useRef<string | null>(null)

    const storageKey = `${VISIBLE_COLUMNS_STORAGE_KEY_PREFIX}:${reportType}`
    const allColumnIds = useMemo(() => columns.map(column => column.id), [columns])

    useEffect(() => {
        setVisibleColumnIds(readStoredColumnIds(storageKey, allColumnIds) ?? FALLBACK_COLUMN_IDS)
    }, [storageKey, allColumnIds])

    useEffect(() => {
        if (hydratedStorageKeyRef.current !== storageKey) {
            // First run after mount or a report-type switch: `visibleColumnIds`
            // may still hold the previous type's selection, so skip this write
            // to avoid leaking it into the new type's storage entry.
            hydratedStorageKeyRef.current = storageKey
            return
        }
        try {
            localStorage.setItem(storageKey, JSON.stringify(visibleColumnIds))
        } catch {
            // ignore quota / disabled storage
        }
    }, [storageKey, visibleColumnIds])

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

    const toggleColumn = useCallback(
        (columnId: string, checked: boolean) => {
            setVisibleColumnIds(prev => {
                if (checked) {
                    if (prev.includes(columnId)) return prev
                    const next = new Set([...prev, columnId])
                    return allColumnIds.filter(id => next.has(id))
                }
                if (prev.length <= 1) return prev
                return prev.filter(id => id !== columnId)
            })
        },
        [allColumnIds],
    )

    const selectAllColumns = useCallback(() => {
        setVisibleColumnIds(allColumnIds)
    }, [allColumnIds])

    const resetColumns = useCallback(() => {
        setVisibleColumnIds(FALLBACK_COLUMN_IDS)
    }, [])

    const sortedRows = useMemo(() => [...rows].sort(sortRowsByRoster), [rows])

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

    useEffect(() => {
        setCurrentPage(1)
    }, [filteredRows, rowsPerPage])

    const pagedRows = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage
        return filteredRows.slice(start, start + rowsPerPage)
    }, [filteredRows, currentPage, rowsPerPage])

    const groupMeta = useMemo(() => {
        const map = new Map<keyof DatumGT, CellMeta[]>()
        for (const colId of GROUPED_COLUMN_IDS) {
            map.set(colId, computeGroupMeta(pagedRows, colId))
        }
        return map
    }, [pagedRows])

    const visibleColumns = useMemo(() => {
        const selected = new Set(visibleColumnIds)
        return columns.filter(column => selected.has(column.id))
    }, [columns, visibleColumnIds])

    const summary = useMemo<TableSummary>(() => {
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

    const columnSelectorItems = useMemo<ColumnSelectorItem[]>(() => {
        const onlyOne = visibleColumnIds.length === 1
        const selected = new Set(visibleColumnIds)
        return columns.map(column => {
            const checked = selected.has(column.id)
            return {
                column,
                checked,
                isOnlySelected: checked && onlyOne,
            }
        })
    }, [columns, visibleColumnIds])

    const isGroupedColumn = useCallback(
        (columnId: string) => GROUPED_COLUMN_IDS.has(columnId as keyof DatumGT),
        [],
    )

    return {
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        sortedRows,
        filteredRows,
        pagedRows,
        visibleColumns,
        groupMeta,
        isGroupedColumn,
        summary,
        columnSelector: {
            isOpen: isColumnSelectorOpen,
            setIsOpen: setIsColumnSelectorOpen,
            containerRef: columnSelectorRef,
            items: columnSelectorItems,
            visibleCount: visibleColumnIds.length,
            totalCount: allColumnIds.length,
            toggle: toggleColumn,
            selectAll: selectAllColumns,
            reset: resetColumns,
        },
    }
}
