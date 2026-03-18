import { useState, useEffect, useCallback } from 'react'
import { attendanceApi } from '@/api'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { User } from '@/interfaces/takeAttendance.interface'
import { dateIsWeekend } from '@/utils/formatDate'
import { AttendancePayload } from '@/api/attendance.api'

export const useTeamAttendances = (
  selectedLeader: string,
  selectedUad: string,
  startDate: string,
  endDate: string,
  setLoadingPage: (loading: boolean) => void,
  employeeCode: string | undefined,
) => {
  const [users, setUsers] = useState<User[]>([])
  const [attendancesByUser, setAttendancesByUser] = useState<{ agent_roster: number; name: string, fechas: { fecha: string, attendance_type: string | null, weekend: boolean }[] }[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setUsers([])
    setAttendancesByUser([])
  }, [selectedUad])

  useEffect(() => {
    if (!selectedLeader || !selectedUad || !startDate || !endDate) return

    const userPayload: any = {
      uadId: selectedUad,
      dateFrom: dayjs(startDate).format('YYYYMMDD'),
      dateTo: dayjs(endDate).format('YYYYMMDD'),
      supervisor: selectedLeader,
    }

    attendanceApi
      .getUsersByLeader(userPayload)
      .then((res) => {
        setUsers(res.data || [])
        setLoadingPage(false)
      })
      .catch((err) => {
        console.error('Error loading users', err)
        toast.error('No se pudieron cargar los usuarios del líder')
        setLoadingUsers(false)
      })
  }, [selectedLeader, selectedUad, startDate, endDate, setLoadingPage])

  useEffect(() => {
    if (!users.length) {
      return
    }
    const userPayload: any = {
      uadId: selectedUad,
      dateFrom: dayjs(startDate).format('YYYYMMDD'),
      dateTo: dayjs(endDate).format('YYYYMMDD'),
      supervisor: selectedLeader,
    }
    attendanceApi
      .getAttendancesByDateRangeAndSupervisor(userPayload)
      .then((res) => {
        const result = users.map(agent => ({
          ...agent,
          fechas: res.data
            .filter((r: { agent_roster: number }) => r.agent_roster === agent.agent_roster)
            .map((r: { fecha: string; attendance_type: string; weekend: boolean }) => ({
              fecha: r.fecha,
              attendance_type: r.attendance_type,
              weekend: dateIsWeekend(r.fecha)
            })),
        }))
        setAttendancesByUser(result)
        setLoadingUsers(false)
      })
      .catch((err) => {
        console.error('Error fetching attendances', err)
        toast.error('No se pudieron cargar las asistencias de los usuarios')
        setLoadingUsers(false)
      })
  }, [users, selectedUad, startDate, endDate, selectedLeader])

  const handleAttendanceChange = useCallback((agent_roster: number, date: string, value: string) => {
    setAttendancesByUser((prevAttendances) =>
      prevAttendances.map((user) => {
        if (user.agent_roster == agent_roster) {
          return {
            ...user,
            fechas: user.fechas.map((fecha) =>
              fecha.fecha.substring(0, 10) == date
                ? { ...fecha, attendance_type: value }
                : fecha
            ),
          }
        }
        return user
      })
    )
  }, [])

  const handleSaveAll = useCallback(async () => {
    const userPayload: AttendancePayload = {
      uadId: selectedUad,
      responsable: employeeCode, // Default or currently logged in responsible id
      attendances: attendancesByUser
    }
    setSaving(true)
    attendanceApi
      .saveAttendance(userPayload)
      .then((res) => {
        toast.success('Asistencia guardada correctamente')
      })
      .catch((err) => {
        console.error('Error saving attendance', err)
        toast.error('No se pudieron guardar las asistencias')
      })
      .finally(() => setSaving(false))
  }, [attendancesByUser, selectedUad])

  return {
    users,
    setUsers,
    attendancesByUser,
    setAttendancesByUser,
    loadingUsers,
    setLoadingUsers,
    saving,
    handleAttendanceChange,
    handleSaveAll
  }
}
