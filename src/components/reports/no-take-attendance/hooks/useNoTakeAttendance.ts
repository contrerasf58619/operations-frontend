import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { SortingState } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { attendanceApi } from '@/api'
import { useGetEmployeeCode } from '@/hooks'
import { useCurrentAndPreviousPayrollPeriods } from '@/hooks/attendance/useCurrentAndPreviousPayrollPeriods'
import { AgentNoAttendanceRow, NoTakeAttendanceRow } from '../types'

export const useNoTakeAttendance = () => {
    const { employeeCode } = useGetEmployeeCode()

    const [selectedUad, setSelectedUad] = useState<string>('')
    const [data, setData] = useState<NoTakeAttendanceRow[]>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [loading, setLoading] = useState(false)

    const [selectedSupervisor, setSelectedSupervisor] = useState<NoTakeAttendanceRow | null>(null)
    const [agentsNoAttendance, setAgentsNoAttendance] = useState<AgentNoAttendanceRow[]>([])
    const [loadingAgents, setLoadingAgents] = useState(false)
    const agentsRequestIdRef = useRef(0)

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

    const handleUadChange = useCallback(
        (uad: string) => {
            setSelectedUad(uad)
            setSelectedPayrollPeriod(null)
            setStartDate('')
            setEndDate('')
            setData([])
        },
        [setSelectedPayrollPeriod, setStartDate, setEndDate],
    )

    useEffect(() => {
        if (!selectedUad || !startDate || !endDate || !employeeCode) {
            setData([])
            return
        }

        let cancelled = false

        const fetchNoTakeAttendance = async () => {
            setLoading(true)
            try {
                const payload = {
                    rosterId: employeeCode,
                    dateFrom: dayjs(startDate).utc().locale('es').format('YYYYMMDD'),
                    dateTo: dayjs(endDate).utc().locale('es').format('YYYYMMDD'),
                    uadId: selectedUad,
                }

                const response = await attendanceApi.getSupervisorsWhoHavenotTakeAttendance(payload)
                if (cancelled) return

                const rows: NoTakeAttendanceRow[] = (response.data || []).map(item => ({
                    sup_code: Number(item.sup_code) || 0,
                    name: item.name ?? '',
                    total_agentes: Number(item.total_agentes) || 0,
                    agentes_sin_asistencia: Number(item.agentes_sin_asistencia) || 0,
                    dias_sin_asistencia: Number(item.dias_sin_asistencia) || 0,
                }))

                setData(rows)
                toast.success(`Se cargaron ${rows.length} supervisores`)
            } catch (error) {
                if (cancelled) return
                console.error('Error al consultar reporte de no toma de asistencia:', error)
                toast.error('Error al consultar el reporte de no toma de asistencia')
                setData([])
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchNoTakeAttendance()

        return () => {
            cancelled = true
        }
    }, [selectedUad, startDate, endDate, employeeCode])

    const handleExportExcel = useCallback(() => {
        if (data.length === 0) return

        import('xlsx').then(XLSX => {
            const exportData = data.map(row => ({
                Código: row.sup_code,
                Nombre: row.name,
                'Total agentes': row.total_agentes,
                'Agentes sin asistencias': row.agentes_sin_asistencia,
                'Días sin asistencias': row.dias_sin_asistencia,
            }))

            const worksheet = XLSX.utils.json_to_sheet(exportData)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, 'No toma asistencia')
            XLSX.writeFile(
                workbook,
                `reporte_no_toma_asistencia_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`,
            )
        })
    }, [data])

    const handleCloseSupervisorDetail = useCallback(() => {
        agentsRequestIdRef.current += 1
        setSelectedSupervisor(null)
        setAgentsNoAttendance([])
        setLoadingAgents(false)
    }, [])

    const handleOpenSupervisorDetail = useCallback(
        async (supervisor: NoTakeAttendanceRow) => {
            if (!selectedUad || !startDate || !endDate) return

            const requestId = ++agentsRequestIdRef.current
            setSelectedSupervisor(supervisor)
            setAgentsNoAttendance([])
            setLoadingAgents(true)

            try {
                const payload = {
                    supervisor: supervisor.sup_code,
                    dateFrom: dayjs(startDate).utc().locale('es').format('YYYYMMDD'),
                    dateTo: dayjs(endDate).utc().locale('es').format('YYYYMMDD'),
                    uadId: selectedUad,
                }

                const response =
                    await attendanceApi.getAgentsWhoHavenotAttendanceBySupervisor(payload)
                if (agentsRequestIdRef.current !== requestId) return

                setAgentsNoAttendance(response.data || [])
            } catch (error) {
                if (agentsRequestIdRef.current !== requestId) return
                console.error('Error al consultar agentes sin asistencia:', error)
                toast.error('Error al consultar los agentes sin asistencia')
                setAgentsNoAttendance([])
            } finally {
                if (agentsRequestIdRef.current === requestId) {
                    setLoadingAgents(false)
                }
            }
        },
        [selectedUad, startDate, endDate],
    )

    return {
        selectedUad,
        handleUadChange,
        payrollPeriods,
        selectedPayrollPeriod,
        setSelectedPayrollPeriod,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        loadingPayroll,
        data,
        sorting,
        setSorting,
        globalFilter,
        setGlobalFilter,
        loading,
        handleExportExcel,
        selectedSupervisor,
        agentsNoAttendance,
        loadingAgents,
        handleOpenSupervisorDetail,
        handleCloseSupervisorDetail,
    }
}
