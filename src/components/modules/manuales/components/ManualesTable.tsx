import React, { useMemo, useState } from 'react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import { Manual } from '../interfaces/manual.interface'
import { LuSearch, LuX } from 'react-icons/lu'
import { useManualesColumns } from '../hooks/useManualesColumns'

interface ManualesTableProps {
    data: Manual[]
    onView: (manual: Manual) => void
}

export const ManualesTable: React.FC<ManualesTableProps> = ({ data, onView }) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas')

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = Array.from(new Set(data.map(m => m.category)))
        return ['Todas', ...cats.sort()]
    }, [data])

    // Filter by selected category before passing to table
    const filteredData = useMemo(() => {
        if (selectedCategory === 'Todas') return data
        return data.filter(manual => manual.category === selectedCategory)
    }, [data, selectedCategory])

    const { columns } = useManualesColumns(onView)

    const table = useReactTable({
        data: filteredData,
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
        <div className='bg-white'>
            {/* Search and Category Filter Bar */}
            <div className='flex flex-col md:flex-row gap-4 items-stretch md:items-end justify-between'>
                {/* Header */}
                <div>
                    <h1 className='text-3xl font-bold text-gray-900'>Manuales</h1>
                    <p className='text-gray-500 text-sm mt-1'>
                        Consulta y visualiza los manuales de procedimientos operativos
                    </p>
                </div>

                {/* Search Input */}
                <div className='relative flex-1 max-w-md'>
                    <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
                        <LuSearch className='w-4 h-4 text-gray-400' />
                    </div>
                    <input
                        type='text'
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder='Buscar por nombre, descripción o palabras clave...'
                        className='w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                    />
                    {globalFilter && (
                        <button
                            onClick={() => setGlobalFilter('')}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer'
                        >
                            <LuX className='w-4 h-4' />
                        </button>
                    )}
                </div>
            </div>

            {/* Category Pills & Count */}
            <div className='py-4 flex items-center gap-2 flex-wrap'>
                <div className='flex items-center gap-1.5 flex-wrap'>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                                selectedCategory === category
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className='hidden sm:block h-6 w-px bg-gray-200 mx-1' />

                <div className='px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 font-medium flex items-center gap-1.5 whitespace-nowrap'>
                    <span className='text-gray-400'>Total:</span>
                    <span className='font-bold text-gray-900'>
                        {table.getFilteredRowModel().rows.length}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr
                                key={headerGroup.id}
                                className='border-b border-gray-200 bg-gray-50/75'
                            >
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className='text-xs font-semibold text-gray-600 px-4 py-3 cursor-pointer hover:bg-gray-100/75 select-none transition-colors border border-gray-200 whitespace-nowrap text-left'
                                        style={{ minWidth: header.column.columnDef.size }}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className='flex items-center gap-2'>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            <span className='text-gray-400 font-bold'>
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
                                    className='hover:bg-blue-50/40 transition-colors border-b border-gray-100'
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className='px-4 py-3 text-sm text-gray-700 border border-gray-100 align-middle'
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
                                    className='px-6 py-14 text-center text-sm text-gray-500'
                                >
                                    <div className='flex flex-col items-center gap-2'>
                                        <LuSearch className='w-8 h-8 text-gray-300' />
                                        <p className='font-semibold text-gray-600'>
                                            No se encontraron manuales
                                        </p>
                                        <p className='text-gray-400 text-xs'>
                                            Intenta con otros términos de búsqueda o selecciona otra
                                            categoría
                                        </p>
                                        {(globalFilter || selectedCategory !== 'Todas') && (
                                            <button
                                                onClick={() => {
                                                    setGlobalFilter('')
                                                    setSelectedCategory('Todas')
                                                }}
                                                className='mt-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium cursor-pointer'
                                            >
                                                Limpiar filtros
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {table.getFilteredRowModel().rows.length > 0 && (
                <div className='flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white'>
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
                                {[10, 25, 50, 100].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='text-gray-700 font-medium'>
                            {table.getState().pagination.pageIndex *
                                table.getState().pagination.pageSize +
                                1}
                            -
                            {Math.min(
                                (table.getState().pagination.pageIndex + 1) *
                                    table.getState().pagination.pageSize,
                                table.getFilteredRowModel().rows.length,
                            )}{' '}
                            de {table.getFilteredRowModel().rows.length}
                        </div>

                        <div className='flex items-center gap-1.5'>
                            <button
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                                className='p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer'
                                title='Primera página'
                            >
                                <svg
                                    className='w-4 h-4'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className='p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer'
                                title='Página anterior'
                            >
                                <svg
                                    className='w-4 h-4'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M15 19l-7-7 7-7'
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className='p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer'
                                title='Página siguiente'
                            >
                                <svg
                                    className='w-4 h-4'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M9 5l7 7-7 7'
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                                className='p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer'
                                title='Última página'
                            >
                                <svg
                                    className='w-4 h-4'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M13 5l7 7-7 7M5 5l7 7-7 7'
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
