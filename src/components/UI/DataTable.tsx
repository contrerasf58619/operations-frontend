'use client'

import { useMemo } from 'react'
import { Table, ColumnDef, flexRender } from '@tanstack/react-table'
import Icons from '@/utils/icons'

interface DataTableProps<T> {
    table: Table<T>
    columns: ColumnDef<T>[]
    data: T[]
    loading?: boolean
    searchValue?: string
    pageIndex: number
    pageSize: number
    onPageSizeChange: (size: number) => void
    onPageIndexChange: (index: number) => void
}

export function DataTable<T>({
    table,
    columns,
    data,
    loading = false,
    searchValue = '',
    pageIndex,
    pageSize,
    onPageSizeChange,
    onPageIndexChange,
}: DataTableProps<T>) {
    // Filtrado local de datos
    const filteredData = useMemo(() => {
        if (!searchValue.trim()) return data

        const searchLower = searchValue.toLowerCase()
        return data.filter(item => {
            // Buscar en todos los valores del objeto
            return Object.values(item as any).some(value => {
                if (value === null || value === undefined) return false
                return String(value).toLowerCase().includes(searchLower)
            })
        })
    }, [data, searchValue])
    console.log('loading', loading)
    const totalItems = filteredData.length

    // Obtener las filas visibles de la tabla filtrada
    const visibleRows = useMemo(() => {
        const start = pageIndex * pageSize
        const end = start + pageSize
        return filteredData.slice(start, end)
    }, [filteredData, pageIndex, pageSize])

    return (
        <>
            {/* Tabla */}
            <div className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr
                                key={headerGroup.id}
                                className='bg-gray-100 border-b border-gray-200'
                            >
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className='px-4 py-3 text-left text-sm font-semibold text-gray-700'
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={
                                                    header.column.getCanSort()
                                                        ? 'cursor-pointer select-none flex items-center gap-2'
                                                        : ''
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                                {header.column.getCanSort() && (
                                                    <span className='text-gray-400'>
                                                        {{
                                                            asc: '🔼',
                                                            desc: '🔽',
                                                        }[header.column.getIsSorted() as string] ??
                                                            '⬍'}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {visibleRows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className='px-4 py-8 text-center text-gray-500'
                                >
                                    No hay datos disponibles
                                </td>
                            </tr>
                        ) : (
                            visibleRows.map((row, index) => (
                                <tr
                                    key={index}
                                    className='border-b border-gray-200 hover:bg-gray-50 transition-colors'
                                >
                                    {columns.map((column: any, colIndex) => {
                                        const cellValue = column.accessorKey
                                            ? (row as any)[column.accessorKey]
                                            : null

                                        return (
                                            <td
                                                key={colIndex}
                                                className='px-4 py-3 text-sm text-gray-700'
                                            >
                                                {column.cell && typeof column.cell === 'function'
                                                    ? column.cell({
                                                          row: { original: row },
                                                          getValue: () => cellValue,
                                                      })
                                                    : cellValue || '-'}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className='mt-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-700'>Filas por página:</span>
                    <select
                        value={pageSize}
                        onChange={e => {
                            onPageSizeChange(Number(e.target.value))
                            onPageIndexChange(0)
                        }}
                        className='px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0FA3B1]'
                    >
                        {[10, 50, 100, -1].map(size => (
                            <option key={size} value={size}>
                                {size === -1 ? 'Todo' : size}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='flex items-center gap-4'>
                    <span className='text-sm text-gray-700'>
                        {pageIndex * pageSize + 1}-
                        {Math.min((pageIndex + 1) * pageSize, totalItems)} de {totalItems}
                    </span>
                    <div className='flex gap-1'>
                        <button
                            onClick={() => onPageIndexChange(Math.max(0, pageIndex - 1))}
                            disabled={pageIndex === 0}
                            className='p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <Icons.MdChevronLeft className='text-xl' />
                        </button>
                        <button
                            onClick={() =>
                                onPageIndexChange(
                                    Math.min(Math.ceil(totalItems / pageSize) - 1, pageIndex + 1),
                                )
                            }
                            disabled={pageIndex >= Math.ceil(totalItems / pageSize) - 1}
                            className='p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            <Icons.MdChevronRight className='text-xl' />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
