import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'

import { Autocomplete, AutocompleteOption } from '../components/UI/Autocomplete'

// --- Sample data ---
const sampleOptions: AutocompleteOption[] = [
    { value: 1, label: 'Carlos García' },
    { value: 2, label: 'María López' },
    { value: 3, label: 'Juan Martínez' },
    { value: 4, label: 'Ana Rodríguez' },
    { value: 5, label: 'Pedro Sánchez' },
]

const meta = {
    title: 'Components/Autocomplete',
    component: Autocomplete,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Campo de autocompletado con búsqueda y selección de opciones filtradas en tiempo real.',
            },
        },
    },
} satisfies Meta<typeof Autocomplete>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        options: sampleOptions,
        value: null,
        placeholder: 'Buscar empleado...',
        noOptionsText: 'No se encontraron empleados.',
    },
    render: function Render(args) {
        const [value, setValue] = useState<string | number | null>(args.value)
        return (
            <div style={{ maxWidth: 320 }}>
                <Autocomplete
                    {...args}
                    value={value}
                    onChange={val => setValue(val === '' ? null : val)}
                />
            </div>
        )
    },
}
