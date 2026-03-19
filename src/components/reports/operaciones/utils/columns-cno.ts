import { ConexionNetaOpeDatum } from '../interfaces/ConexionNetaOpeRow.interface'
import type { ReactNode } from 'react'

type RowKey = keyof ConexionNetaOpeDatum

type TableColumn = {
    id: string
    label: string
    sourceKeys: RowKey[]
    render: (row: ConexionNetaOpeDatum) => ReactNode
    headerClassName?: string
    cellClassName?: string
}

function hasValue(value: unknown) {
    return value !== null && value !== undefined && String(value).trim() !== ''
}

function formatValue(value: unknown) {
    if (!hasValue(value)) {
        return '--'
    }

    return String(value)
}

export const COLUMN_DEFINITIONS: TableColumn[] = [
    {
        id: 'ROSTER',
        label: 'Roster',
        sourceKeys: ['ROSTER'],
        render: row => row.ROSTER,
        cellClassName: 'font-semibold text-charcoal whitespace-nowrap',
    },
    {
        id: 'NOMBRE',
        label: 'Nombre',
        sourceKeys: ['NOMBRE'],
        render: row => row.NOMBRE,
        cellClassName: 'min-w-[220px]',
    },
    {
        id: 'FECHA',
        label: 'Fecha',
        sourceKeys: ['FECHA'],
        render: row => formatValue(row.FECHA),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'NOMENCLATURA',
        label: 'Nomenclatura',
        sourceKeys: ['NOMENCLATURA'],
        render: row => formatValue(row.NOMENCLATURA),
        cellClassName: 'text-center',
    },
    {
        id: 'HORARIO',
        label: 'Horario',
        sourceKeys: ['HORARIO'],
        render: row => formatValue(row.HORARIO),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'PLANNED',
        label: 'Planned',
        sourceKeys: ['PLANNED'],
        render: row => formatValue(row.PLANNED),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'POSICION AGENTE',
        label: 'Posicion Agente',
        sourceKeys: ['POSICION AGENTE'],
        render: row => formatValue(row['POSICION AGENTE']),
    },
    {
        id: 'POSICION SUP',
        label: 'Posicion Sup',
        sourceKeys: ['POSICION SUP'],
        render: row => formatValue(row['POSICION SUP']),
    },
    {
        id: 'WP_HOURS',
        label: 'WP Hours',
        sourceKeys: ['WP_HOURS'],
        render: row => formatValue(row.WP_HOURS),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'LAW_HOURS',
        label: 'Law Hours',
        sourceKeys: ['LAW_HOURS'],
        render: row => formatValue(row.LAW_HOURS),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'CALCULATED_LAW_HOURS',
        label: 'Calculated Law Hours',
        sourceKeys: ['CALCULATED_LAW_HOURS'],
        render: row => formatValue(row.CALCULATED_LAW_HOURS),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'LOGIN AMD',
        label: 'Login AMD',
        sourceKeys: ['LOGIN AMD'],
        render: row => formatValue(row['LOGIN AMD']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'LOGOUT AMD',
        label: 'Logout AMD',
        sourceKeys: ['LOGOUT AMD'],
        render: row => formatValue(row['LOGOUT AMD']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'LOGIN DMD',
        label: 'Login DMD',
        sourceKeys: ['LOGIN DMD'],
        render: row => formatValue(row['LOGIN DMD']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'LOGOUT DMD',
        label: 'Logout DMD',
        sourceKeys: ['LOGOUT DMD'],
        render: row => formatValue(row['LOGOUT DMD']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'STAFFED TIME HORAS',
        label: 'Staffed Time Horas',
        sourceKeys: ['STAFFED TIME HORAS'],
        render: row => formatValue(row['STAFFED TIME HORAS']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'MISSING TIME HORAS',
        label: 'Missing Time Horas',
        sourceKeys: ['MISSING TIME HORAS'],
        render: row => formatValue(row['MISSING TIME HORAS']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'WP_TOTAL',
        label: 'WP Total',
        sourceKeys: ['WP_TOTAL'],
        render: row => formatValue(row.WP_TOTAL),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'VTO',
        label: 'VTO',
        sourceKeys: ['VTO'],
        render: row => formatValue(row.VTO),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'TOTAL',
        label: 'Total',
        sourceKeys: ['TOTAL'],
        render: row => formatValue(row.TOTAL),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'ASISTENCIA',
        label: 'Asistencia',
        sourceKeys: ['ASISTENCIA'],
        render: row => formatValue(row.ASISTENCIA),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'PASE',
        label: 'Pase',
        sourceKeys: ['PASE'],
        render: row => formatValue(row.PASE),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'FINAL',
        label: 'Final',
        sourceKeys: ['FINAL'],
        render: row => formatValue(row.FINAL),
        cellClassName: 'whitespace-nowrap',
    },
    {
        id: 'CONEXION_NETA',
        label: 'Conexión Neta',
        sourceKeys: ['CONEXION_NETA'],
        render: row => formatValue(row.CONEXION_NETA),
        cellClassName: 'font-mono whitespace-nowrap text-teal font-semibold',
    },
    {
        id: 'CONEXION_NETA_CALCULADA',
        label: 'Conexión Neta Calc',
        sourceKeys: ['CONEXION_NETA_CALCULADA'],
        render: row => formatValue(row.CONEXION_NETA_CALCULADA),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'CONEXION_AMD',
        label: 'Conexión AMD',
        sourceKeys: ['CONEXION_AMD'],
        render: row => formatValue(row.CONEXION_AMD),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'CONEXION_DMD',
        label: 'Conexión DMD',
        sourceKeys: ['CONEXION_DMD'],
        render: row => formatValue(row.CONEXION_DMD),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'DIFERENCIA',
        label: 'Diferencia',
        sourceKeys: ['DIFERENCIA'],
        render: row => formatValue(row.DIFERENCIA),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'HORAS_EXTRA_SEG',
        label: 'Horas Extra Seg',
        sourceKeys: ['HORAS_EXTRA_SEG'],
        render: row => formatValue(row.HORAS_EXTRA_SEG),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'HORAS DDD',
        label: 'Horas DDD',
        sourceKeys: ['HORAS DDD'],
        render: row => formatValue(row['HORAS DDD']),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'HORAS_JORNADA_SEG',
        label: 'Horas Jornada Seg',
        sourceKeys: ['HORAS_JORNADA_SEG'],
        render: row => formatValue(row.HORAS_JORNADA_SEG),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'HORAS_DESCUENTO_SEG',
        label: 'Horas Descuento Seg',
        sourceKeys: ['HORAS_DESCUENTO_SEG'],
        render: row => formatValue(row.HORAS_DESCUENTO_SEG),
        cellClassName: 'font-mono whitespace-nowrap',
    },
    {
        id: 'SEPTIMO_PROPORCIONAL',
        label: 'Septimo Proporcional',
        sourceKeys: ['SEPTIMO_PROPORCIONAL'],
        render: row => formatValue(row.SEPTIMO_PROPORCIONAL),
        cellClassName: 'font-mono whitespace-nowrap',
    },
]
