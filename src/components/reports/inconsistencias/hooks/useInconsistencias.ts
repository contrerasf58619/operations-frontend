import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { InconsistenciaRow } from '../types'
import { SortingState } from '@tanstack/react-table'
import { useGetEmployeeCode } from '@/hooks'
import dayjs from 'dayjs'
import { omniaApi } from '@/api'
import { fetchAndParseCsv, generateCsvContent } from '../utils/inconsistenciaCsv'
import { useEmployeeContext } from '@/context/employee/EmployeeContext'

export const useInconsistencias = () => {
    const { employeeCode } = useGetEmployeeCode()
    const { employee } = useEmployeeContext()

    const name = `${employee?.employee.contacto.NOMBRE1} ${employee?.employee.contacto.APELLIDO1}`

    const [reportType, setReportType] = useState<string>('horas.allied-inconsistencias')
    const [startDate, setStartDate] = useState<string>(
        dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    )
    const [endDate, setEndDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
    const [data, setData] = useState<InconsistenciaRow[]>([])
    const [modifiedRows, setModifiedRows] = useState<InconsistenciaRow[]>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(false)
    const [authLoading, setAuthLoading] = useState(false)
    const [token, setToken] = useState('')
    const [authenticated, setAuthenticated] = useState(false)
    const [codSupervisor, setCodSupervisor] = useState<string>('')

    const [legajosJefes, setLegajosJefes] = useState<number[]>([])
    const [selectedJefe, setSelectedJefe] = useState<number | null>(null)
    const [availableInconsistencias, setAvailableInconsistencias] = useState<string[]>([])
    const [selectedInconsistencias, setSelectedInconsistencias] = useState<string[]>([])

    // Fetch CODIGOSUPERVISOR on page load
    useEffect(() => {
        if (!employeeCode) return
        omniaApi
            .getDataByEmployeeCode(employeeCode)
            .then(({ data }) => {
                if (data?.data?.CODIGOSUPERVISOR) {
                    setCodSupervisor(String(data.data.CODIGOSUPERVISOR))
                }
            })
            .catch(err => {
                console.error('Error al obtener datos del empleado:', err)
            })
    }, [employeeCode])

    // Handlers for date range restriction (max 7 days)
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setStartDate(val)
        if (val && endDate) {
            const maxEnd = dayjs(val).add(7, 'day').format('YYYY-MM-DD')
            if (dayjs(endDate).isBefore(dayjs(val))) {
                setEndDate(val)
            } else if (dayjs(endDate).isAfter(dayjs(maxEnd))) {
                setEndDate(maxEnd)
            }
        }
    }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setEndDate(val)
        if (val && startDate) {
            const minStart = dayjs(val).subtract(7, 'day').format('YYYY-MM-DD')
            if (dayjs(startDate).isAfter(dayjs(val))) {
                setStartDate(val)
            } else if (dayjs(startDate).isBefore(dayjs(minStart))) {
                setStartDate(minStart)
            }
        }
    }

    // Handler for inline edits on tipoDesconexion
    const handleTipoDesconexionChange = useCallback(
        (targetRow: InconsistenciaRow, value: string) => {
            const updatedRow = { ...targetRow, tipoDesconexion: value }

            setData(prev => prev.map(row => (row.id === targetRow.id ? updatedRow : row)))

            setModifiedRows(prev => {
                const index = prev.findIndex(r => r.id === targetRow.id)
                if (index >= 0) {
                    const updated = [...prev]
                    updated[index] = updatedRow
                    return updated
                }
                return [...prev, updatedRow]
            })
        },
        [],
    )

    // Handler for inline edits on motivo
    const handleMotivoChange = useCallback((targetRow: InconsistenciaRow, value: string) => {
        const updatedRow = { ...targetRow, motivo: value }

        setData(prev => prev.map(row => (row.id === targetRow.id ? updatedRow : row)))

        setModifiedRows(prev => {
            const index = prev.findIndex(r => r.id === targetRow.id)
            if (index >= 0) {
                const updated = [...prev]
                updated[index] = updatedRow
                return updated
            }
            return [...prev, updatedRow]
        })
    }, [])

    // Handle authenticate
    const handleAuthenticate = async (): Promise<string | null> => {
        if (token) return token

        setAuthLoading(true)
        try {
            const username = process.env.NEXT_PUBLIC_OMNIA_USERNAME || ''
            const password = process.env.NEXT_PUBLIC_OMNIA_PASSWORD || ''
            const { data } = await omniaApi.login({ username, password })
            if (data?.token) {
                setToken(data.token)
                setAuthenticated(true)
                return data.token
            }
            return null
        } catch (error) {
            console.error('Error al autenticarse en Omnia:', error)
            return null
        } finally {
            setAuthLoading(false)
        }
    }

    const extraerLegajosUnicos = (data: InconsistenciaRow[]) => {
        const legajos = data
            .map(item => Number(item.legajoJefeInmediato))
            .filter(legajo => !isNaN(legajo) && legajo > 0)
        return Array.from(new Set(legajos)).sort((a, b) => a - b)
    }

    const filteredData = useMemo(() => {
        let result = data

        if (selectedInconsistencias.length > 0) {
            result = result.filter(row => selectedInconsistencias.includes(row.inconsistencia))
        } else {
            result = []
        }

        if (selectedJefe && selectedJefe !== 0) {
            result = result.filter(row => Number(row.legajoJefeInmediato) === Number(selectedJefe))
        }

        return result
    }, [data, selectedJefe, selectedInconsistencias])

    // Handle search reports
    const handleSearchReports = async () => {
        let tokenGenerate = token || ''
        if (startDate && endDate) {
            const diffDays = dayjs(endDate).diff(dayjs(startDate), 'day')
            if (diffDays < 0) {
                toast.error('La fecha "Hasta" no puede ser menor a la fecha "Desde"')
                return
            }
            if (diffDays > 7) {
                toast.error('El rango de fechas entre Desde y Hasta no puede ser mayor a 7 días')
                return
            }
        }

        setLoading(true)
        setModifiedRows([])
        try {
            if (!tokenGenerate) {
                tokenGenerate = (await handleAuthenticate()) || ''
            }

            const response = await omniaApi.getReporte(
                {
                    reporte: reportType,
                    desde: startDate,
                    hasta: endDate,
                },
                tokenGenerate,
            )

            const reportId = Number(response.data)

            // Polling: consultar el estado cada 2 segundos
            let isCompleted = false
            let retries = 0
            const maxRetries = 15 // Tiempo máximo ~30 segundos
            while (!isCompleted && retries < maxRetries) {
                // Esperar 2 segundos entre intentos
                await new Promise(resolve => setTimeout(resolve, 2000))
                retries++
                const statusResponse = await omniaApi.getReporteStatus(
                    { id: reportId },
                    tokenGenerate,
                )
                const statusData = statusResponse.data

                if (statusData.status === 'success') {
                    isCompleted = true
                    const csvUrl = statusData.data
                    // Obtener y parsear el CSV
                    const rows = await fetchAndParseCsv(
                        csvUrl,
                        employeeCode || '',
                        codSupervisor || '',
                    )
                    const sortedRows = rows.sort((a, b) => b.tiempoDiferencia - a.tiempoDiferencia)
                    const uniqueInc = Array.from(
                        new Set(sortedRows.map(r => r.inconsistencia)),
                    ).filter(Boolean) as string[]
                    setAvailableInconsistencias(uniqueInc)
                    setSelectedInconsistencias(uniqueInc)

                    const legajosUnicos = extraerLegajosUnicos(sortedRows)
                    setLegajosJefes(legajosUnicos)
                    setData(sortedRows)
                    toast.success(`Se cargaron ${sortedRows.length} registros`)
                } else if (statusData.status === 'failed' || statusData.status === 'error') {
                    throw new Error('El servidor no pudo generar el reporte')
                }
            }
            if (!isCompleted) {
                toast.error('El reporte está tardando demasiado en generarse. Intenta más tarde.')
            }
        } catch (error) {
            console.log(error)
            toast.error('Error al buscar reportes')
        } finally {
            setLoading(false)
        }
    }

    // Handle save all (Guardar)
    const handleSaveAll = async () => {
        if (modifiedRows.length === 0) {
            toast.info('No hay cambios para guardar.')
            return
        }

        setSaving(true)
        try {
            const csvContent = generateCsvContent(modifiedRows)
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
            const fileName = `Inconsistencias_Modificadas_por_${name}_${dayjs().format('YYYYMMDD_HHmmss')}.csv`
            const file = new File([blob], fileName, { type: 'text/csv' })
            try {
                const response = await omniaApi.postFile(file, token || undefined)
                const idJob = response?.data?.idJob
                toast.success(
                    `Se enviaron ${modifiedRows.length} ${modifiedRows.length === 1 ? 'registro modificado' : 'registros modificados'} correctamente. (ID Job: ${idJob})`,
                )
            } catch (err) {
                console.error('Error al enviar el archivo a Omnia:', err)
                toast.warning(
                    'No se pudo enviar el archivo al servidor, iniciando descarga local...',
                )
            }

            // Descargar copia localmente
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.log(error)
            toast.error('Ocurrió un error al generar el reporte CSV')
        } finally {
            setSaving(false)
            handleSearchReports()
        }
    }

    return {
        reportType,
        startDate,
        endDate,
        data,
        filteredData,
        modifiedRows,
        sorting,
        setSorting,
        globalFilter,
        setGlobalFilter,
        saving,
        loading,
        authLoading,
        authenticated,
        handleStartDateChange,
        handleEndDateChange,
        handleTipoDesconexionChange,
        handleMotivoChange,
        handleAuthenticate,
        handleSearchReports,
        handleSaveAll,
        setReportType,
        legajosJefes,
        selectedJefe,
        setSelectedJefe,
        availableInconsistencias,
        selectedInconsistencias,
        setSelectedInconsistencias,
    }
}
