import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { LuUser, LuFlag, LuTag, LuMail, LuBuilding2, LuCircleDot } from 'react-icons/lu'

import { Filters } from '../components/UI/Custom/filters/Filters'
import type { Filter, FilterFieldConfig } from '../components/UI/Custom/filters/filters.types'
import { createFilter } from '../components/UI/Custom/filters/filters.utils'

// --- Sample data ---
const supervisorOptions = [
    { value: '1', label: 'Carlos García' },
    { value: '2', label: 'María López' },
    { value: '3', label: 'Juan Martínez' },
    { value: '4', label: 'Ana Rodríguez' },
    { value: '5', label: 'Pedro Sánchez' },
    { value: '6', label: 'Lucía Fernández' },
    { value: '7', label: 'Diego Ramírez' },
]

const priorityOptions = [
    { value: 'urgent', label: 'Urgent', icon: <LuCircleDot className='text-red-400' /> },
    { value: 'high', label: 'High', icon: <LuCircleDot className='text-amber' /> },
    { value: 'medium', label: 'Medium', icon: <LuCircleDot className='text-cyan' /> },
    { value: 'low', label: 'Low', icon: <LuCircleDot className='text-white/40' /> },
]

const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'closed', label: 'Closed' },
]

const departmentOptions = [
    { value: 'ops', label: 'Operations' },
    { value: 'eng', label: 'Engineering' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'fin', label: 'Finance' },
]

const sampleFields: FilterFieldConfig[] = [
    {
        key: 'supervisor',
        label: 'Supervisor',
        icon: <LuUser className='size-3.5' />,
        type: 'select-multi',
        options: supervisorOptions,
    },
    {
        key: 'priority',
        label: 'Priority',
        icon: <LuFlag className='size-3.5' />,
        type: 'select-multi',
        options: priorityOptions,
    },
    {
        key: 'status',
        label: 'Status',
        icon: <LuTag className='size-3.5' />,
        type: 'select-single',
        options: statusOptions,
    },
    {
        key: 'department',
        label: 'Department',
        icon: <LuBuilding2 className='size-3.5' />,
        type: 'select-multi',
        options: departmentOptions,
    },
    {
        key: 'email',
        label: 'Email',
        icon: <LuMail className='size-3.5' />,
        type: 'text',
        placeholder: 'name@company.com',
    },
]

const meta = {
    title: 'Components/Filters',
    component: Filters,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#0b0c0e' }],
        },
        docs: {
            description: {
                component:
                    'Filtro reutilizable inspirado en el patrón de shadcn Filters. Soporta campos de texto, selección única y selección múltiple. Las píldoras activas se muestran debajo del botón disparador.',
            },
        },
    },
} satisfies Meta<typeof Filters>

export default meta
type Story = StoryObj<typeof meta>

// Helper wrapper that gives stories a dark surface to render against and
// owns the `filters` state that the component requires.
function FiltersHarness({
    initialFilters = [],
    maxFilters,
    fields = sampleFields,
}: {
    initialFilters?: Filter[]
    maxFilters?: number
    fields?: FilterFieldConfig[]
}) {
    const [filters, setFilters] = useState<Filter[]>(initialFilters)

    return (
        <div className='min-h-[420px] rounded-lg bg-[#0b0c0e] p-6'>
            <Filters
                fields={fields}
                filters={filters}
                onChange={setFilters}
                maxFilters={maxFilters}
            />

            <div className='mt-6 rounded-md border border-white/10 bg-charcoal p-3 text-xs text-white/70'>
                <p className='mb-1 font-medium text-white/90'>Active filters (state):</p>
                <pre className='max-h-48 overflow-auto whitespace-pre-wrap text-white/60'>
                    {JSON.stringify(filters, null, 2)}
                </pre>
            </div>
        </div>
    )
}

export const Default: Story = {
    args: {
        fields: sampleFields,
        filters: [],
        onChange: () => {},
    },
    render: function Render() {
        return <FiltersHarness />
    },
}

export const WithActiveFilters: Story = {
    args: {
        fields: sampleFields,
        filters: [],
        onChange: () => {},
    },
    render: function Render() {
        const initial: Filter[] = [
            createFilter('supervisor', 'is any of', ['1', '3']),
            createFilter('status', 'is', ['open']),
        ]
        return <FiltersHarness initialFilters={initial} />
    },
}

export const TextFieldOnly: Story = {
    args: {
        fields: sampleFields,
        filters: [],
        onChange: () => {},
    },
    render: function Render() {
        const fields: FilterFieldConfig[] = [
            {
                key: 'email',
                label: 'Email',
                icon: <LuMail className='size-3.5' />,
                type: 'text',
                placeholder: 'name@company.com',
            },
        ]
        return <FiltersHarness fields={fields} />
    },
}

export const MultiSelectOnly: Story = {
    args: {
        fields: sampleFields,
        filters: [],
        onChange: () => {},
    },
    render: function Render() {
        const fields: FilterFieldConfig[] = [
            {
                key: 'supervisor',
                label: 'Supervisor',
                icon: <LuUser className='size-3.5' />,
                type: 'select-multi',
                options: supervisorOptions,
            },
        ]
        return <FiltersHarness fields={fields} />
    },
}

export const SingleSelectOnly: Story = {
    args: {
        fields: sampleFields,
        filters: [],
        onChange: () => {},
    },
    render: function Render() {
        const fields: FilterFieldConfig[] = [
            {
                key: 'status',
                label: 'Status',
                icon: <LuTag className='size-3.5' />,
                type: 'select-single',
                options: statusOptions,
            },
        ]
        return <FiltersHarness fields={fields} />
    },
}

export const WithMaxFilters: Story = {
    args: {
        fields: sampleFields,
        filters: [],
        onChange: () => {},
    },
    render: function Render() {
        return <FiltersHarness maxFilters={2} />
    },
    parameters: {
        docs: {
            description: {
                story: 'Limita el número de filtros activos a 2. Una vez alcanzado, el dropdown muestra un mensaje en color amber.',
            },
        },
    },
}
