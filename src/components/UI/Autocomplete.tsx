import React, { useState, useEffect, useRef } from 'react'

export interface AutocompleteOption {
    value: string | number
    label: string
}

export interface AutocompleteProps {
    options: AutocompleteOption[]
    value: string | number | null
    onChange: (value: string | number | '') => void
    placeholder?: string
    disabled?: boolean
    className?: string
    noOptionsText?: string
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Buscar...',
    disabled = false,
    className = '',
    noOptionsText = 'No se encontraron opciones',
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const wrapperRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Sync input value with the selected option label when value or options change
    useEffect(() => {
        const selectedOption = options.find(opt => opt.value === value)
        if (selectedOption) {
            setInputValue(selectedOption.label)
        } else if (value === '' || value === null || value === undefined) {
            setInputValue('')
        }
    }, [value, options])

    // Click outside to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                // Revert input value to the selected option label on blur
                const selectedOption = options.find(opt => opt.value === value)
                if (selectedOption) {
                    setInputValue(selectedOption.label)
                } else {
                    setInputValue('')
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [value, options])

    // Filter options based on input value
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
    )

    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setInputValue('')
        onChange('')
        setIsOpen(true)
        inputRef.current?.focus()
    }

    return (
        <div ref={wrapperRef} className={`relative w-full ${className}`}>
            <div className='relative w-full'>
                <input
                    ref={inputRef}
                    type='text'
                    value={inputValue}
                    onChange={e => {
                        setInputValue(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete='off'
                    className='w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-100 disabled:text-gray-500'
                />
                {/* Icons */}
                <div className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400'>
                    {inputValue && !disabled ? (
                        <button
                            type='button'
                            onClick={handleClear}
                            className='p-1 hover:text-gray-600 focus:outline-none transition-colors'
                            aria-label='Limpiar selección'
                        >
                            <svg
                                className='w-4 h-4 cursor-pointer'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M6 18L18 6M6 6l12 12'
                                ></path>
                            </svg>
                        </button>
                    ) : (
                        <div className='pointer-events-none p-1'>
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M19 9l-7 7-7-7'
                                ></path>
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {isOpen && !disabled && (
                <ul className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <li key={option.value}>
                                <button
                                    type='button'
                                    onClick={() => {
                                        onChange(option.value)
                                        setInputValue(option.label)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors ${
                                        option.value === value
                                            ? 'bg-blue-100 font-medium text-blue-900'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className='px-3 py-2 text-gray-500 text-sm'>{noOptionsText}</li>
                    )}
                </ul>
            )}
        </div>
    )
}
