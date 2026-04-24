import { CompoundCondition, DependsOn, FormFieldConfig, SimpleCondition } from '../entities'

export function isCompoundCondition(dep: DependsOn): dep is CompoundCondition {
    return 'conditions' in dep
}

export function evaluateSimpleCondition(
    condition: SimpleCondition,
    formValues: Record<string, string>,
): boolean {
    const fieldValue = formValues[condition.field] ?? ''
    switch (condition.operator) {
        case '===':
            return fieldValue === condition.value
        case '!==':
            return fieldValue !== '' && fieldValue !== condition.value
        case 'notEmpty':
            return fieldValue !== ''
        default:
            return false
    }
}

export function isFieldVisible(
    field: FormFieldConfig,
    formValues: Record<string, string>,
): boolean {
    if (!field.dependsOn) return !field.hidden
    const dep = field.dependsOn
    if (isCompoundCondition(dep)) {
        const results = dep.conditions.map(c => evaluateSimpleCondition(c, formValues))
        return dep.operator === 'OR' ? results.some(Boolean) : results.every(Boolean)
    }
    return evaluateSimpleCondition(dep as SimpleCondition, formValues)
}

export const getBehavioralIndicator = (obj: any) => {
    const suffix = '_behavioral_indicator'
    for (const [key, value] of Object.entries(obj)) {
        if (key.endsWith(suffix) && value !== '') {
            return value
        }
    }
    return ''
}

export const getBehavioralIndicatorOther = (obj: any) => {
    const suffix = '_other'
    for (const [key, value] of Object.entries(obj)) {
        if (key.endsWith(suffix) && value !== '') {
            return value
        }
    }
    return ''
}

export const isOtherValue = (value: string) => value.toLowerCase() === 'other'
