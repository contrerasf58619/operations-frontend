import { omniaApi } from '@/api'
import { InconsistenciaRow } from '../types'
import { calculateDifferenceHours } from '@/utils'

// Helper: Generar contenido CSV con las columnas solicitadas
export const generateCsvContent = (rows: InconsistenciaRow[]) => {
    const headers = [
        'Legajo',
        'Documento',
        'Nombre completo',
        'Fecha',
        'Ingreso',
        'Salida',
        'Inconsistencia',
        'Descripción',
        'Intervalo desde',
        'Intervalo hasta',
        'Tipo de Desconexion',
        'Motivo',
        'COD_AUTORIZANTE_NIVEL 1',
        'COD_AUTORIZANTE_NIVEL 2',
    ]

    const escapeCsvValue = (val: string | undefined | null) => {
        if (val === undefined || val === null) return ''
        const stringVal = String(val)
        if (stringVal.includes(';') || stringVal.includes('"') || stringVal.includes('\n')) {
            return `"${stringVal.replace(/"/g, '""')}"`
        }
        return stringVal
    }

    const lines = [headers.join(';')]

    rows.forEach(row => {
        const line = [
            escapeCsvValue(row.legajo),
            escapeCsvValue(row.documento),
            escapeCsvValue(row.nombreCompleto),
            escapeCsvValue(row.fecha),
            escapeCsvValue(row.ingreso),
            escapeCsvValue(row.salida),
            escapeCsvValue(row.inconsistencia),
            escapeCsvValue(row.descripcion),
            escapeCsvValue(row.intervaloDesde),
            escapeCsvValue(row.intervaloHasta),
            escapeCsvValue(row.tipoDesconexion),
            escapeCsvValue(row.motivo),
            escapeCsvValue(row.codAutorizanteNivel1),
            escapeCsvValue(row.codAutorizanteNivel2),
        ].join(';')
        lines.push(line)
    })

    return lines.join('\n')
}

// Utility: fetch CSV text from URL and parse into InconsistenciaRow[]
export const fetchAndParseCsv = async (
    csvUrl: string,
    employeeCode: string,
    codSupervisor: string,
) => {
    const response = await omniaApi.getCsvData({ url: csvUrl, delimiter: ';' })

    return response.data.map((item: any, index: number) => {
        return {
            id: index + 1,
            legajo: item['Legajo'] || '',
            documento: item['Documento'] || '',
            nombreCompleto: item['Nombre completo'] || '',
            fecha: item['Fecha'] || '',
            ingreso: item['Ingreso'] || '',
            salida: item['Salida'] || '',
            inconsistencia: item['Inconsistencia'] || '',
            descripcion: item['Descripción'] || '',
            intervaloDesde: item['Intervalo desde'] || '',
            intervaloHasta: item['Intervalo hasta'] || '',
            tipoDesconexion: item['Tipo de Desconexion'] || item['Tipo de Desconexión'] || '',
            motivo: item['Motivo'] || '',
            codigoPuesto: item['Código Puesto'] || '',
            legajoJefeInmediato: Number(item['Legajo Jefe Inmediato']) || 0,
            puestoEmpleado: item['Puesto Empleado'] || '',
            codAutorizanteNivel1: employeeCode,
            codAutorizanteNivel2: codSupervisor,
            tiempoDiferencia: calculateDifferenceHours(item['Ingreso'], item['Salida']),
        }
    })
}
