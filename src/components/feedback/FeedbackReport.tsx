'use client'

import { DataTable } from '../UI/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { CoachingSession } from '@/api/coachingSession.api'
import dayjs from 'dayjs'
import { useCoachingSessions } from '@/hooks/coachingSession'
import { FileLink } from './components/FileLink'
import * as XLSX from 'xlsx'
import * as FileSaver from 'file-saver'
import { Loading } from '../UI/Loading'

export const columnsFeedback: ColumnDef<CoachingSession>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'leader_name',
        header: 'Nombre del Líder',
    },
    {
        accessorKey: 'agent_name',
        header: 'Nombre del Agente',
    },
    {
        accessorKey: 'agent_employee_code',
        header: 'Código de Empleado',
    },
    {
        accessorKey: 'coaching_date',
        header: 'Fecha del Coaching',
        cell: (info: any) => (
            <span className={`inline-flex items-center`}>
                {dayjs(info.getValue() as string)
                    .utc()
                    .format('YYYY-MM-DD')}
            </span>
        ),
    },
    {
        accessorKey: 'coaching_type',
        header: 'Tipo de Coaching',
    },
    {
        accessorKey: 'metric',
        header: 'Métrica',
    },
    {
        accessorKey: 'behavioral_indicator',
        header: 'Indicador Conductual',
    },
    {
        accessorKey: 'coaching_comments',
        header: 'Comentarios del Coaching',
    },
    {
        accessorKey: 'strengths',
        header: 'Fortalezas',
    },
    {
        accessorKey: 'opportunities',
        header: 'Oportunidades',
    },
    {
        accessorKey: 'action_plan',
        header: 'Plan de Acción',
    },
    {
        accessorKey: 'coaching_related_attachments',
        header: 'Archivos Relacionados',
        cell: (info: any) => (
            <span className={`inline-flex flex-row gap-2`}>
                {(info.getValue() as string)
                    .split(',')
                    .map(file => (file.trim() ? <FileLink key={file} file={file.trim()} /> : '-'))}
            </span>
        ),
    },
    {
        accessorKey: 'leader_commitment',
        header: 'Compromiso del Líder',
    },
    {
        accessorKey: 'created_at',
        header: 'Fecha de Creación',
        cell: (info: any) => (
            <span className={`inline-flex items-center`}>
                {dayjs(info.getValue() as string)
                    .utc()
                    .format('YYYY-MM-DD HH:mm:ss')}
            </span>
        ),
    },
]

const FeedbackReport = () => {
    const { sessions, loading } = useCoachingSessions(43)

    const downloadExcel = () => {
        if (sessions.length === 0) return
        const dataToExport = sessions.map((item: any) => {
            const row: Record<string, any> = {}
            for (const header of columnsFeedback as any) {
                row[header.header] = item[header.accessorKey] as any
            }
            return row
        })

        const ws = XLSX.utils.json_to_sheet(dataToExport)
        const wb = XLSX.utils.book_new()

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const fileType =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        const blob = new Blob([excelBuffer], { type: fileType })

        FileSaver.saveAs(blob, `GWL Temporary Coaching form.xlsx`)
    }

    return (
        <div className='p-6 bg-gray-50 min-h-screen rounded-lg'>
            <h1 className='text-4xl font-bold mb-2 text-gray-900'>Feedback Report</h1>
            <p className='text-gray-600'>GWL Temporary Coaching Form - Reports</p>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <button
                        className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center my-4'
                        onClick={downloadExcel}
                    >
                        Excel
                    </button>
                    <DataTable
                        data={sessions}
                        columns={columnsFeedback}
                        searchPlaceholder='Buscar...'
                        noDataText='No se encontraron sesiones de coaching.'
                    />
                </>
            )}
        </div>
    )
}

export default FeedbackReport
