export interface SimpleCondition {
    field: string
    operator: '===' | '!==' | 'notEmpty'
    value: string | boolean
}

export interface CompoundCondition {
    operator: 'OR' | 'AND'
    conditions: SimpleCondition[]
}

export type DependsOn = SimpleCondition | CompoundCondition

export interface FieldOption {
    id: number
    label: string
    value: string
}

export interface FormFieldConfig {
    id: number
    type: string
    placeholder: string
    label: string
    name: string
    required: boolean
    disabled: boolean
    readOnly: boolean
    hidden: boolean
    pattern?: string
    options?: FieldOption[]
    dependsOn?: DependsOn
    allowedExtensions?: string[]
    maxFiles?: number
    maxFileSizeMB?: number
}

export interface AttachmentResponse {
    bucket: string
    key: string
    url: string
}
