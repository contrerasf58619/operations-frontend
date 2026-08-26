import { useMemo } from 'react'
import { Manual } from '../interfaces/manual.interface'
import { ColumnDef } from '@tanstack/react-table'
import { LuEye } from 'react-icons/lu'

export const useManualesColumns = (onView: (manual: Manual) => void) => {
    const columns = useMemo<ColumnDef<Manual>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Documento',
                size: 280,
                cell: ({ row }) => {
                    const manual = row.original
                    return (
                        <div className='flex items-center gap-3 py-1'>
                            <div className='min-w-0'>
                                <button
                                    type='button'
                                    className='font-semibold text-gray-900 text-sm leading-tight hover:text-blue-600 transition-colors cursor-pointer text-left'
                                    onClick={() => onView(manual)}
                                >
                                    {manual.name}
                                </button>
                            </div>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'category',
                header: 'Categoría',
                size: 140,
                cell: ({ getValue }) => {
                    const category = getValue<string>()
                    return (
                        <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200'>
                            {category}
                        </span>
                    )
                },
            },
            {
                accessorKey: 'description',
                header: 'Descripción',
                size: 320,
                cell: ({ getValue }) => {
                    const description = getValue<string>()
                    return (
                        <p className='text-sm text-gray-600 line-clamp-2 leading-relaxed'>
                            {description}
                        </p>
                    )
                },
            },
            {
                accessorKey: 'keywords',
                header: 'Palabras Clave',
                size: 260,
                cell: ({ getValue }) => {
                    const keywords = getValue<string>()
                    if (!keywords) return null
                    const tags = keywords
                        .split(',')
                        .map(t => t.trim())
                        .filter(Boolean)
                    return (
                        <div className='flex flex-wrap gap-1 py-1'>
                            {tags.slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className='px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium'
                                >
                                    {tag}
                                </span>
                            ))}
                            {tags.length > 3 && (
                                <span
                                    className='px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-medium'
                                    title={tags.slice(3).join(', ')}
                                >
                                    +{tags.length - 3}
                                </span>
                            )}
                        </div>
                    )
                },
            },
            {
                id: 'actions',
                header: 'Acción',
                size: 40,
                cell: ({ row }) => {
                    const manual = row.original
                    return (
                        <button
                            onClick={() => onView(manual)}
                            className='inline-flex items-center justify-center gap-1.5 px-2 py-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg transition-all duration-200 text-xs font-semibold cursor-pointer shadow-xs'
                        >
                            <LuEye className='w-4 h-4' />
                        </button>
                    )
                },
            },
        ],
        [onView],
    )

    return {
        columns,
    }
}
