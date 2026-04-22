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
import type { DatumWild } from '@/components/reports/operaciones/interfaces/ConexionNetaOpeRow.interface'
import { COLUMN_DEFINITIONS } from '@/components/reports/operaciones/utils/columns-cno'

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]

export const FALLBACK_COLUMN_IDS: string[] = [
    'ROSTER',
    'NOMBRE',
    'FECHA',
    'HORARIO',
    'NOMENCLATURA',
    'FINAL',
]

export const GROUPED_COLUMN_IDS = new Set<keyof DatumWild>([
    'WP_HOURS',
    'LAW_HOURS',
    'CALCULATED_LAW_HOURS',
    'HORAS_EXTRA_SEG',
])

const ALL_COLUMN_IDS: string[] = COLUMN_DEFINITIONS.map(column => column.id)
const VISIBLE_COLUMNS_STORAGE_KEY = 'conexion-neta-ope:visible-columns'

export type TableColumn = (typeof COLUMN_DEFINITIONS)[number]
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

export interface UseTableConexionNetaReturn {
    searchQuery: string
    setSearchQuery: Dispatch<SetStateAction<string>>
    currentPage: number
    setCurrentPage: Dispatch<SetStateAction<number>>
    rowsPerPage: PageSize
    setRowsPerPage: Dispatch<SetStateAction<PageSize>>
    totalPages: number
    sortedRows: DatumWild[]
    filteredRows: DatumWild[]
    pagedRows: DatumWild[]
    visibleColumns: TableColumn[]
    groupMeta: Map<keyof DatumWild, CellMeta[]>
    isGroupedColumn: (columnId: string) => boolean
    summary: TableSummary
    columnSelector: ColumnSelectorAPI
}

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

export function useTableConexionNeta(rows: DatumWild[]): UseTableConexionNetaReturn {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState<PageSize>(5)
    const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(FALLBACK_COLUMN_IDS)
    const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false)
    const columnSelectorRef = useRef<HTMLDivElement>(null)

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
            localStorage.setItem(VISIBLE_COLUMNS_STORAGE_KEY, JSON.stringify(visibleColumnIds))
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

    const selectAllColumns = useCallback(() => {
        setVisibleColumnIds(ALL_COLUMN_IDS)
    }, [])

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
        return COLUMN_DEFINITIONS.map(column => {
            const checked = selected.has(column.id)
            return {
                column,
                checked,
                isOnlySelected: checked && onlyOne,
            }
        })
    }, [visibleColumnIds])

    const isGroupedColumn = useCallback(
        (columnId: string) => GROUPED_COLUMN_IDS.has(columnId as keyof DatumWild),
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
            totalCount: ALL_COLUMN_IDS.length,
            toggle: toggleColumn,
            selectAll: selectAllColumns,
            reset: resetColumns,
        },
    }
}
