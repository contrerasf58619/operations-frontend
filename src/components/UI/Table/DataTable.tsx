/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from 'react'
import { useFormatDate } from '@/hooks/useFormatDate'
import { useTranslations } from 'next-intl'

import Icons from '@/utils/icons'

interface Column {
    key: string
    title: string
    render?: (value: any, row: Record<string, any>) => React.ReactNode
}

interface DataTableProps {
    columns: Column[]
    data: Record<string, any>[]
    handleDelete?: (rowData: Record<string, any>) => void
    handleEdit?: (rowData: Record<string, any>) => void
    showActions?: boolean
}

export const DataTable: React.FC<DataTableProps> = ({
    columns,
    data,
    handleDelete,
    handleEdit,
    showActions = true,
}) => {
    const { formatDate } = useFormatDate()
    const t = useTranslations()

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState('')

    // Filter data based on search
    const filteredData = data?.filter(row =>
        columns.some(column =>
            String(row[column.key])?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    )

    // Determine if all rows should be shown
    const isShowingAll = rowsPerPage === -1
    const totalPages = isShowingAll ? 1 : Math.ceil(filteredData.length / rowsPerPage)
    const startIndex = (currentPage - 1) * rowsPerPage
    const visibleData = isShowingAll
        ? filteredData
        : filteredData.slice(startIndex, startIndex + rowsPerPage)

    return (
        <div className='w-full mx-auto overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200/80'>
            {/* Header with row selector and search */}
            <div className='px-6 py-5 border-b border-gray-200/80 bg-gradient-to-br from-white via-white to-indigo-50/30'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between mb-4'>
                    <div>
                        <p className='text-sm text-gray-500 mt-0.5'>Manage and view your data</p>
                    </div>

                    <select
                        value={rowsPerPage}
                        onChange={e => {
                            const value = Number(e.target.value)
                            setRowsPerPage(value)
                            setCurrentPage(1)
                        }}
                        className='bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 hover:border-gray-400 transition-colors'
                    >
                        <option value={10}>10 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={-1}>{t('general.all')}</option>
                    </select>
                </div>

                {/* Search Bar */}
                <div className='relative'>
                    <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
                        🔍
                    </span>
                    <input
                        type='text'
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 focus:bg-white transition-all'
                    />
                </div>
            </div>

            {/* Table */}
            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead>
                        <tr className='bg-gradient-to-r from-gray-50 via-indigo-50/30 to-gray-50 border-b border-gray-200'>
                            {columns.map(column => (
                                <th
                                    key={column.key}
                                    className='px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide'
                                >
                                    {column.title}
                                </th>
                            ))}
                            {showActions && (handleEdit || handleDelete) && (
                                <th className='px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide'>
                                    {t('general.actions')}
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-100'>
                        {visibleData.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className='hover:bg-indigo-50/30 transition-colors group'
                            >
                                {columns.map(column => (
                                    <td
                                        key={column.key}
                                        className='px-6 py-4 text-sm text-gray-900'
                                    >
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : (() => {
                                                  const raw = row[column.key]
                                                  const isDate = Boolean(
                                                      raw && !isNaN(new Date(raw).getTime()),
                                                  )
                                                  return isDate ? formatDate(raw) : raw
                                              })()}
                                    </td>
                                ))}
                                {showActions && (handleEdit || handleDelete) && (
                                    <td className='px-6 py-4 text-sm text-right'>
                                        <div className='flex justify-end gap-1'>
                                            {handleEdit && (
                                                <button
                                                    onClick={() => handleEdit(row)}
                                                    className='p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all'
                                                    title='Edit'
                                                >
                                                    <Icons.MdModeEditOutline size={18} />
                                                </button>
                                            )}
                                            {handleDelete && (
                                                <button
                                                    onClick={() => handleDelete(row)}
                                                    className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all'
                                                    title='Delete'
                                                >
                                                    <Icons.MdDelete size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!isShowingAll && (
                <div className='px-6 py-4 bg-gradient-to-r from-white via-indigo-50/20 to-white border-t border-gray-200'>
                    <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                        <div className='text-sm text-gray-600'>
                            Showing{' '}
                            <span className='font-medium text-indigo-700'>{startIndex + 1}</span> to{' '}
                            <span className='font-medium text-indigo-700'>
                                {Math.min(startIndex + rowsPerPage, filteredData.length)}
                            </span>{' '}
                            of{' '}
                            <span className='font-medium text-indigo-700'>
                                {filteredData.length}
                            </span>{' '}
                            entries
                        </div>

                        <div className='flex items-center gap-1'>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                                    currentPage === 1
                                        ? 'text-gray-300 cursor-not-allowed bg-white border-gray-200'
                                        : 'text-gray-700 bg-white border-gray-300 hover:bg-indigo-50/50 hover:border-indigo-300'
                                }`}
                            >
                                Previous
                            </button>

                            {/* Numbered Pagination with Ellipsis */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
                                page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`min-w-[36px] h-9 rounded-lg font-medium text-sm transition-all ${
                                            currentPage === page
                                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                                                : 'text-gray-600 hover:bg-indigo-50/50 hover:text-indigo-700'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ),
                            )}

                            {totalPages > 5 && (
                                <>
                                    <span className='px-1 text-gray-400'>...</span>
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        className={`min-w-[36px] h-9 rounded-lg font-medium text-sm transition-all ${
                                            currentPage === totalPages
                                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                                                : 'text-gray-600 hover:bg-indigo-50/50 hover:text-indigo-700'
                                        }`}
                                    >
                                        {totalPages}
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() =>
                                    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))
                                }
                                disabled={currentPage >= totalPages}
                                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                                    currentPage >= totalPages
                                        ? 'text-gray-300 cursor-not-allowed bg-white border-gray-200'
                                        : 'text-gray-700 bg-white border-gray-300 hover:bg-indigo-50/50 hover:border-indigo-300'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
