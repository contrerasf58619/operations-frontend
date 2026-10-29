import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { ReportAttendanceRow } from '../types'
import { SortingState } from '@tanstack/react-table'
import { useGetEmployeeCode } from '@/hooks'
import dayjs from 'dayjs'
import { usePayrollPeriods } from '@/hooks/attendance/usePayrollPeriods'
import { useLeaders } from '@/hooks/attendance/useLeaders'
import { attendanceApi } from '@/api'
import { useCurrentAndPreviousPayrollPeriods } from '@/hooks/attendance/useCurrentAndPreviousPayrollPeriods'

export const useReportAttendance = () => {
    const { employeeCode } = useGetEmployeeCode()

    const [selectedUad, setSelectedUad] = useState<string>('')
    const [data, setData] = useState<ReportAttendanceRow[]>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [loading, setLoading] = useState(false)

    const {
        payrollPeriods,
        selectedPayrollPeriod,
        setSelectedPayrollPeriod,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        loadingPayroll,
    } = useCurrentAndPreviousPayrollPeriods(selectedUad)

    const { leaders, selectedLeader, setSelectedLeader, loadingLeaders } = useLeaders(
        selectedUad,
        startDate,
        endDate,
        employeeCode,
    )

    const filteredData = useMemo(() => {
        return data
    }, [data])

    useEffect(() => {
        setData([])
        setSelectedLeader('')
    }, [selectedUad, startDate])

    const handleSearchReports = async (leaderOverride?: string) => {
        const leader = leaderOverride ?? selectedLeader
        if (!selectedUad || !selectedPayrollPeriod || !leader) return

        setLoading(true)
        try {
            const payload = {
                uadId: selectedUad,
                dateFrom: dayjs(startDate).utc().locale('es').format('YYYYMMDD'),
                dateTo: dayjs(endDate).utc().locale('es').format('YYYYMMDD'),
                supervisor: leader,
            }

            const response = await attendanceApi.getReportAttendancesByDateAndSupervisor(payload)
            const rows: ReportAttendanceRow[] = (response.data || []).map(
                (item: any, index: number) => ({
                    id: index + 1,
                    roster_id: item.roster_id ?? item.agent_roster ?? '',
                    fecha: item.fecha ?? '',
                    asistencia: item.asistencia ?? item.attendance_type ?? '',
                    pase: item.pase ?? '',
                    ajuste: item.ajuste ?? '',
                }),
            )

            setData(rows)
            toast.success(`Se cargaron ${rows.length} registros`)
        } catch (error) {
            console.error('Error al buscar reporte de asistencia:', error)
            toast.error('Error al buscar reportes de asistencia')
        } finally {
            setLoading(false)
        }
    }

    // Handle export to Excel
    const handleExportExcel = useCallback(() => {
        if (filteredData.length === 0) return

        import('xlsx').then(XLSX => {
            const exportData = filteredData.map(row => ({
                'Roster ID': row.roster_id,
                Fecha: row.fecha ? dayjs(row.fecha).utc().locale('es').format('DD/MM/YYYY') : '',
                Asistencia: row.asistencia || '',
                Pase: row.pase || '',
                Ajuste: row.ajuste || '',
            }))

            const worksheet = XLSX.utils.json_to_sheet(exportData)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Asistencia')
            XLSX.writeFile(workbook, `reporte_asistencia_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`)
        })
    }, [filteredData])

    return {
        // UAD
        selectedUad,
        setSelectedUad,
        // Payroll periods
        payrollPeriods,
        selectedPayrollPeriod,
        setSelectedPayrollPeriod,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        loadingPayroll,
        // Leaders
        leaders,
        selectedLeader,
        setSelectedLeader,
        loadingLeaders,
        // Report
        data,
        filteredData,
        sorting,
        setSorting,
        globalFilter,
        setGlobalFilter,
        loading,
        handleSearchReports,
        handleExportExcel,
    }
}
