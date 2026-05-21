import type { Filter, FilterFieldConfig, FilterOperator } from './filters.types'

export function createFilter(key: string, operator: FilterOperator, values: string[]): Filter {
    return {
        id: crypto.randomUUID(),
        key,
        operator,
        values,
    }
}

export function getFieldConfig(
    fields: FilterFieldConfig[],
    key: string,
): FilterFieldConfig | undefined {
    return fields.find(f => f.key === key)
}

export function formatPillLabel(filter: Filter, fields: FilterFieldConfig[]): string {
    const field = getFieldConfig(fields, filter.key)
    const label = field?.label ?? filter.key

    if (filter.operator === 'is empty') {
        return `${label} is empty`
    }

    if (filter.values.length === 0) {
        return `${label} ${filter.operator}`
    }

    const valueLabels = filter.values.map(v => {
        const opt = field?.options?.find(o => o.value === v)
        return opt?.label ?? v
    })

    return `${label} ${filter.operator} ${valueLabels.join(', ')}`
}

export function getOptionLabel(field: FilterFieldConfig | undefined, value: string): string {
    return field?.options?.find(o => o.value === value)?.label ?? value
}

export function defaultOperatorFor(type: FilterFieldConfig['type']): FilterOperator {
    switch (type) {
        case 'text':
            return 'contains'
        case 'select-single':
            return 'is'
        case 'select-multi':
            return 'is any of'
    }
}
