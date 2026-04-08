import type { Meta, StoryObj } from '@storybook/nextjs'
import { ColumnDef } from '@tanstack/react-table'

import { DataTable } from '../components/UI/DataTable'

// --- Sample data ---
interface Employee {
    id: number
    name: string
    department: string
    position: string
    salary: number
    status: string
}

const sampleEmployees: Employee[] = [
    {
        id: 1,
        name: 'Carlos García',
        department: 'Ingeniería',
        position: 'Desarrollador Senior',
        salary: 45000,
        status: 'Activo',
    },
    {
        id: 2,
        name: 'María López',
        department: 'Diseño',
        position: 'Diseñadora UX',
        salary: 38000,
        status: 'Activo',
    },
    {
        id: 3,
        name: 'Juan Martínez',
        department: 'Ingeniería',
        position: 'Desarrollador Junior',
        salary: 28000,
        status: 'Activo',
    },
    {
        id: 4,
        name: 'Ana Rodríguez',
        department: 'Recursos Humanos',
        position: 'Coordinadora',
        salary: 35000,
        status: 'Inactivo',
    },
    {
        id: 5,
        name: 'Pedro Sánchez',
        department: 'Ventas',
        position: 'Gerente de Ventas',
        salary: 50000,
        status: 'Activo',
    },
]

// --- Columns ---
const employeeColumns: ColumnDef<Employee, any>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Nombre' },
    { accessorKey: 'department', header: 'Departamento' },
    { accessorKey: 'position', header: 'Puesto' },
    {
        accessorKey: 'salary',
        header: 'Salario',
        cell: (info: any) => `$${(info.getValue() as number).toLocaleString()}`,
    },
    {
        accessorKey: 'status',
        header: 'Estado',
        cell: (info: any) => {
            const status = info.getValue() as string
            const isActive = status === 'Activo'
            return (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                    {status}
                </span>
            )
        },
    },
]

const meta = {
    title: 'Components/DataTable',
    component: DataTable,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Tabla de datos reutilizable con búsqueda, ordenamiento y paginación integrados.',
            },
        },
    },
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        data: sampleEmployees,
        columns: employeeColumns,
        noDataText: 'No hay empleados registrados.',
        searchPlaceholder: 'Buscar empleado...',
    },
}
