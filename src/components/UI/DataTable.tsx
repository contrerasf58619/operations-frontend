import React, { useState } from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
} from '@tanstack/react-table'

interface DataTableProps<TData> {
    data: TData[]
    columns: ColumnDef<TData, any>[]
    searchPlaceholder?: string
    noDataText?: string
}

export function DataTable<TData>({
    data,
    columns,
    searchPlaceholder = 'Buscar...',
    noDataText = 'No se encontraron registros que coincidan con la búsqueda.',
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 10 },
        },
    })

    return (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
            {/* Search Box */}
            <div className='p-4 border-b border-gray-100 bg-white'>
                <div className='relative w-full'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <svg
                            className='h-5 w-5 text-gray-400'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={1.5}
                                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                            />
                        </svg>
                    </div>
                    <input
                        type='text'
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder={searchPlaceholder}
                        className='pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg w-full transition-all text-sm text-gray-700 placeholder-gray-400'
                    />
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className='border-b border-gray-200 bg-white'>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className=' text-sm font-semibold text-gray-700 px-6 py-4 cursor-pointer hover:bg-gray-50 select-none transition-colors border-r last:border-r-0 border-gray-50 whitespace-nowrap'
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className='flex items-center gap-2'>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            <span className='text-gray-400'>
                                                {{
                                                    asc: '↑',
                                                    desc: '↓',
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className='hover:bg-gray-50/50 transition-colors border-b border-gray-200'
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className='px-6 py-3 whitespace-nowrap text-sm text-gray-600 border-r last:border-r-0 border-gray-50'
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className='px-6 py-12 text-center text-sm text-gray-500'
                                >
                                    {noDataText}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            <div className='flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white'>
                <div className='flex flex-1 justify-between sm:hidden'>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className='px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50'
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className='px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50'
                    >
                        Siguiente
                    </button>
                </div>
                <div className='hidden sm:flex flex-1 items-center justify-end gap-6 text-sm text-gray-500'>
                    <div className='flex items-center gap-2'>
                        <span>Filas por página:</span>
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={e => {
                                table.setPageSize(Number(e.target.value))
                            }}
                            className='border-none bg-transparent focus:outline-none focus:ring-0 text-gray-700 font-medium cursor-pointer'
                        >
                            {[10, 50, 100, data.length].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize === data.length ? 'Todo' : pageSize}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='text-gray-700'>
                        {table.getState().pagination.pageIndex *
                            table.getState().pagination.pageSize +
                            1}
                        -
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) *
                                table.getState().pagination.pageSize,
                            table.getPrePaginationRowModel().rows.length,
                        )}{' '}
                        de {table.getPrePaginationRowModel().rows.length}
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className='p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'
                        >
                            <svg
                                className='w-5 h-5'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
                                ></path>
                            </svg>
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className='p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'
                        >
                            <svg
                                className='w-5 h-5'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M15 19l-7-7 7-7'
                                ></path>
                            </svg>
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className='p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'
                        >
                            <svg
                                className='w-5 h-5'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M9 5l7 7-7 7'
                                ></path>
                            </svg>
                        </button>
                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className='p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'
                        >
                            <svg
                                className='w-5 h-5'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M13 5l7 7-7 7M5 5l7 7-7 7'
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
