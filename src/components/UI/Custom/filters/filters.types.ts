import type { ReactNode } from 'react'

export type FilterOperator = 'contains' | 'is' | 'is any of' | 'is not' | 'is empty'

export interface Filter {
    id: string
    key: string
    operator: FilterOperator
    values: string[]
}

export interface FilterOption {
    value: string
    label: string
    avatar?: string
    icon?: ReactNode
}

export interface FilterFieldConfig {
    key: string
    label: string
    icon: ReactNode
    type: 'text' | 'select-single' | 'select-multi'
    placeholder?: string
    options?: FilterOption[]
    className?: string
    validation?: (value: unknown) => { valid: boolean; message?: string }
}
