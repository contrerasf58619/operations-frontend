import { useEffect, useState } from 'react'
import Icons from '@/utils/icons'

export interface FormField {
    name: string
    label: string
    type: 'text' | 'date' | 'number' | 'select' | 'textarea' | 'custom'
    required?: boolean
    placeholder?: string
    options?: { value: any; label: string }[]
    customComponent?: React.ReactNode
    gridCols?: 1 | 2 | 3
}

interface DynamicFormProps {
    title: string
    fields: FormField[]
    initialData?: Record<string, any>
    onClose: () => void
    onSave: (data: Record<string, any>) => Promise<void>
    isCreate?: boolean
    showSaveButton?: boolean
}

export const DynamicForm = ({
    title,
    fields,
    initialData = {},
    onClose,
    onSave,
    isCreate = true,
    showSaveButton = true,
}: DynamicFormProps) => {
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Inicializar formData con valores por defecto
        const defaultData: Record<string, any> = {}
        fields.forEach(field => {
            if (field.type === 'custom') return

            const value = initialData[field.name]
            if (field.type === 'number') {
                defaultData[field.name] = value || 0
            } else {
                defaultData[field.name] = value || ''
            }
        })
        setFormData(defaultData)
    }, [fields, initialData])

    const handleInputChange = (name: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const validation = () => {
        return fields.some(field => {
            if (!field.required) return false
            const value = formData[field.name]
            if (field.type === 'number') {
                return value === null || value === 0
            }
            return !value || value === ''
        })
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await onSave(formData)
        } catch (error) {
            console.error('Error saving form:', error)
        } finally {
            setLoading(false)
        }
    }

    const renderField = (field: FormField) => {
        if (field.type === 'custom') {
            return field.customComponent
        }

        const commonClasses =
            'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0FA3B1] focus:border-transparent'

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        value={formData[field.name] || ''}
                        onChange={e => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={commonClasses}
                        rows={3}
                    />
                )
            case 'select':
                return (
                    <select
                        value={formData[field.name] || ''}
                        onChange={e => handleInputChange(field.name, e.target.value)}
                        className={commonClasses}
                    >
                        <option value=''>Seleccionar...</option>
                        {field.options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )
            case 'number':
                return (
                    <input
                        type='number'
                        value={formData[field.name] || 0}
                        onChange={e => handleInputChange(field.name, Number(e.target.value))}
                        placeholder={field.placeholder}
                        className={commonClasses}
                    />
                )
            case 'date':
                return (
                    <input
                        type='date'
                        value={formData[field.name] || ''}
                        onChange={e => handleInputChange(field.name, e.target.value)}
                        className={commonClasses}
                    />
                )
            default:
                return (
                    <input
                        type='text'
                        value={formData[field.name] || ''}
                        onChange={e => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={commonClasses}
                    />
                )
        }
    }

    return (
        <div className='fixed inset-0 bg-gray-200 bg-opacity-20 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto m-4'>
                {/* Header */}
                <div className='border-b border-gray-200 p-6 sticky top-0 bg-white z-10'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <Icons.MdDraw className='text-3xl text-[#0FA3B1]' />
                            <h2 className='text-2xl font-bold text-gray-800'>
                                {isCreate ? `Crear ${title}` : `Editar ${title}`}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className='text-gray-400 hover:text-gray-600 transition-colors'
                        >
                            <Icons.MdClose className='text-2xl' />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {fields.map(field => (
                            <div
                                key={field.name}
                                className={field.gridCols ? `md:col-span-${field.gridCols}` : ''}
                            >
                                {field.type !== 'custom' && (
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        {field.label}
                                        {field.required && <span className='text-red-500'> *</span>}
                                    </label>
                                )}
                                {renderField(field)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className='border-t border-gray-200 p-6 bg-gray-50 sticky bottom-0'>
                    <div className='flex justify-end gap-3'>
                        <button
                            onClick={onClose}
                            className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                        >
                            Cancelar
                        </button>
                        {showSaveButton && (
                            <button
                                onClick={handleSave}
                                disabled={validation() || loading}
                                className='px-4 py-2 text-white bg-[#0FA3B1] rounded-lg hover:bg-[#0d8a96] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                            >
                                {loading && <Icons.MdRefresh className='animate-spin text-xl' />}
                                Guardar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
