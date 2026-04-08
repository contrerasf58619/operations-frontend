import type { Meta, StoryObj } from '@storybook/nextjs'

import { PayrollPeriodSelector, PayrollPeriod } from '../components/UI/PayrollPeriodSelector'

// --- Sample data ---
const samplePayrollPeriods: PayrollPeriod[] = [
    { date_from: '2026-03-01', date_to: '2026-03-15' },
    { date_from: '2026-03-16', date_to: '2026-03-31' },
    { date_from: '2026-04-01', date_to: '2026-04-15' },
]

const meta = {
    title: 'Components/PayrollPeriodSelector',
    component: PayrollPeriodSelector,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Selector de períodos de nómina. Permite elegir un rango de fechas de los períodos activos disponibles.',
            },
        },
    },
} satisfies Meta<typeof PayrollPeriodSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        payrollPeriods: samplePayrollPeriods,
        selectedPayrollPeriod: samplePayrollPeriods[0],
        onChange: (period: PayrollPeriod) => console.log('Selected:', period),
    },
}
