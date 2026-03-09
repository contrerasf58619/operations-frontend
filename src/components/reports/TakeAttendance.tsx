'use client'

import React, { useState, useEffect, useCallback, use } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { toast } from 'react-toastify'
import { attendanceApi } from '@/api'
import { UadList } from '../catalogs/UadList'
import { useGetEmployeeCode } from '@/hooks'
import { dateIsWeekend } from '@/utils/formatDate'
import { AttendancePayload } from '@/api/attendance.api'
import { Loading } from '../UI/Loading'
import { Autocomplete } from '../UI/Autocomplete'

interface AttendanceEntry {
  userId: string
  userName: string
  entries: Record<string, string>
}

interface User {
  agent_roster: number
  name: string
}

interface AttendanceRecord {
  [key: string]: AttendanceEntry
}

interface Leader {
  sup_code: string
  name: string
}

interface AttendanceType {
  attendance_name: string
  short_name: string
  display: string
}

const TakeAttendance: React.FC = () => {
  // once a payroll period is picked the start and end dates will be set
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [selectedUad, setSelectedUad] = useState<string>('') // administrative unit selected from UadList
  const [selectedLeader, setSelectedLeader] = useState<string>('')

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const { employeeCode } = useGetEmployeeCode()
  const [payrollPeriods, setPayrollPeriods] = useState<Array<{ date_from: string; date_to: string }>>([])
  const [selectedPayrollPeriod, setSelectedPayrollPeriod] = useState<{ date_from: string; date_to: string } | null>(null)
  const [loadingPayroll, setLoadingPayroll] = useState(false)
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [attendancesByUser, setAttendancesByUser] = useState<{ agent_roster: number; name: string, fechas: { fecha: string, attendance_type: string | null, weekend: boolean }[] }[]>([])
  const [attendanceStatuses, setAttendanceStatuses] = useState<AttendanceType[]>([])

  // when UAD or date range changes we fetch payroll periods
  useEffect(() => {
    if (!selectedUad || !employeeCode) {
      setPayrollPeriods([])
      setSelectedPayrollPeriod(null)
      setStartDate('')
      setEndDate('')
      return
    }

    setLoadingPayroll(true)
    attendanceApi
      .getPayrollNextDates({ uadId: selectedUad, rosterId: employeeCode })
      .then((res) => {
        const data = res.data || []
        setPayrollPeriods(data)
        if (data.length > 0) {
          setSelectedPayrollPeriod({ date_from: data[0]?.date_from, date_to: data[0]?.date_to })
          setStartDate(data[0]?.date_from)
          setEndDate(data[0]?.date_to)
        }
      })
      .catch((err) => {
        console.error('Error fetching payroll periods', err)
        toast.error('Error al cargar los periodos de nómina')
      })
      .finally(() => setLoadingPayroll(false))
  }, [selectedUad, employeeCode])


  useEffect(() => {

    if (!selectedUad) {
      return;
    }
    attendanceApi.getAttendanceTypes({ uadId: selectedUad })
      .then((res) => {
        setAttendanceStatuses(res.data || [])
      })
      .catch((err) => {
        console.error('Error fetching attendance types', err)
        toast.error('Error al cargar tipos de asistencia')
      })
  }, [selectedUad])


  // if the UAD changes we need to clear leader dependent data
  useEffect(() => {
    setSelectedLeader('')
    setLeaders([])
    setUsers([])
    setAttendance({})
    setPayrollPeriods([])
    setSelectedPayrollPeriod(null)
    setStartDate('')
    setEndDate('')
  }, [selectedUad])

  // load leaders from API whenever the filter values change
  useEffect(() => {
    if (!selectedUad || !startDate || !endDate || !employeeCode) {
      setLeaders([])
      return
    }

    setLoading(true)
    const payload: any = {
      uadId: selectedUad,
      dateFrom: dayjs(startDate).format('YYYYMMDD'),
      dateTo: dayjs(endDate).format('YYYYMMDD'),
      rosterId: employeeCode,
    }

    attendanceApi
      .getLeaders(payload)
      .then((res) => {
        const data = res.data || []
        data.sort((a: Leader, b: Leader) => a.name.localeCompare(b.name))
        setLeaders(data)
        const currentLeader = data.find((leader: Leader) => leader.sup_code == '58619')
        //const currentLeader = data.find((leader: Leader) => leader.sup_code == employeeCode)
        if (currentLeader) {
          setSelectedLeader(currentLeader.sup_code)
        }
        if (data.length > 0 && !currentLeader) {
          setSelectedLeader(data[0].sup_code)
        }
      })
      .catch((err) => {
        toast.error('No se pudo cargar la lista de líderes')
      })
      .finally(() => setLoading(false))
  }, [selectedUad, startDate, endDate, employeeCode])

  // Load users when leader is selected
  useEffect(() => {
    if (!selectedLeader) return

    setLoading(true)
    // fetch users from API
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
      })
      .finally(() => setLoading(false))
  }, [selectedLeader, selectedUad, startDate, endDate, employeeCode])


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
        }));
        setAttendancesByUser(result);
        setLoadingUsers(false)
      })
      .catch(() => {
        toast.error('No se pudieron cargar los usuarios del líder')
      })
      .finally(() => setLoading(false))
  }, [users])

  // Generate dates between start and end
  const getDatesInRange = useCallback((): Dayjs[] => {
    const dates: Dayjs[] = []
    let current = dayjs(startDate)
    const end = dayjs(endDate)

    while (current.isBefore(end) || current.isSame(end)) {
      dates.push(current)
      current = current.add(1, 'day')
    }
    return dates
  }, [startDate, endDate])

  const handleAttendanceChange = useCallback((agent_roster: number, date: string, value: string) => {
    setAttendancesByUser((prevAttendances) =>
      prevAttendances.map((user) => {
        if (user.agent_roster === agent_roster) {
          return {
            ...user,
            fechas: user.fechas.map((fecha) =>
              fecha.fecha.substring(0, 10) === date
                ? { ...fecha, attendance_type: value }
                : fecha
            ),
          };
        }
        return user;
      })
    );
  }, [])

  const handleSaveAll = useCallback(async () => {
    const userPayload: AttendancePayload = {
      uadId: selectedUad,
      responsable: '58619',
      attendances: attendancesByUser
    }
    setSaving(true)
    attendanceApi
      .saveAttendance(userPayload)
      .then((res) => {
        toast.success('Asistencia guardada correctamente')

      })
      .catch((err) => {
        toast.error('No se pudieron guardar las asistencias')
      })
      .finally(() => setSaving(false))
  }, [attendancesByUser])

  const dates = getDatesInRange()

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Fill your team's attendance</h1>
        <p className="text-gray-600 mb-8">
          Registra y administra la asistencia de tu equipo
        </p>
        {loadingPage && <Loading />}
        <div className={loadingPage ? 'hidden transition-all duration-300' : 'block transition-all duration-300'}>
          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Unidad Administrativa
              </label>
              <div className="space-y-4">
                <UadList
                  value={selectedUad}
                  onChange={(v) => setSelectedUad(v)}
                />
              </div>
            </div>

            {/* Date Range / Payroll Period Selector */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Periodo de nómina
              </label>
              <div className="space-y-4">
                <select
                  value={
                    selectedPayrollPeriod
                      ? `${dayjs(selectedPayrollPeriod.date_from).format('YYYY-MM-DD')} a ${dayjs(selectedPayrollPeriod.date_to).format('YYYY-MM-DD')}`
                      : ''
                  }
                  onChange={(e) => {
                    const [start, end] = e.target.value.split('a')
                    setStartDate(start)
                    setEndDate(end)
                    setSelectedPayrollPeriod({ date_from: start, date_to: end })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  disabled={!selectedUad || loadingPayroll || payrollPeriods.length === 0}
                >
                  {payrollPeriods.map((p) => (
                    <option
                      key={`${p.date_from}-${p.date_to}`}
                      value={`${dayjs(p.date_from).format('YYYY-MM-DD')} a ${dayjs(p.date_to).format('YYYY-MM-DD')}`}
                    >

                      {dayjs(p.date_from).format('YYYY-MM-DD')} - {dayjs(p.date_to).format('YYYY-MM-DD')}
                    </option>
                  ))}
                </select>
                {loadingPayroll && (
                  <div className="text-xs text-gray-500 mt-1">Cargando...</div>
                )}
                {!loadingPayroll && payrollPeriods.length === 0 && selectedLeader && (
                  <div className="text-xs text-red-500 mt-1">
                    No se encontraron periodos disponibles para este líder
                  </div>
                )}
              </div>
            </div>

            {/* Leaders Section */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Seleccionar líder
              </label>
              <div className="space-y-2">
                <Autocomplete
                  value={selectedLeader}
                  onChange={(val) => {
                    setSelectedLeader(val as string)
                    setAttendancesByUser([])
                    setLoadingUsers(true)
                  }}
                  options={leaders.map((leader) => ({ value: leader.sup_code, label: leader.name }))}
                  placeholder="Buscar líder..."
                  disabled={!selectedUad || loading || leaders.length === 0}
                  noOptionsText="No se encontraron líderes"
                />
                {loading && (
                  <div className="text-xs text-gray-500 mt-1">Cargando líderes...</div>
                )}
                {!loading && leaders.length === 0 && selectedUad && (
                  <div className="text-xs text-gray-500 mt-1">No se encontraron líderes</div>
                )}
              </div>
            </div>
          </div>
          {/* Attendance Table */}
          {selectedLeader && users.length > 0 && (
            <>
              {loadingUsers && <Loading />}
              <div className={loadingUsers ? 'hidden transition-all duration-300' : 'block transition-all duration-300'}>
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                          <th className="px-2 py-2 text-left font-bold text-gray-900 min-w-40 sticky left-0 bg-gray-100 z-10">
                            Usuario
                          </th>
                          {dates.map((date) => (
                            <th
                              key={date.format('YYYY-MM-DD')}
                              className="px-2 py-2 text-center font-bold text-gray-900 border-l border-gray-300 min-w-15"
                            >
                              <div className="text-xs font-bold uppercase tracking-wide">
                                {date.format('ddd')}
                              </div>
                              <div className="text-sm font-bold">
                                {date.format('DD')}
                              </div>
                              <div className="text-xs text-gray-600">
                                {date.format('MMM')}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {attendancesByUser.map((user) => (
                          <tr
                            key={user.agent_roster}
                            className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                          >
                            <td className="px-2 py-3 font-semibold text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-300">
                              {user.name}
                            </td>
                            {dates.map((date) => {
                              const dateStr = date.format('YYYY-MM-DD')
                              const attendanceRecord = user.fechas.find((f) => f.fecha.substring(0, 10) == dateStr)
                              return (
                                <td
                                  key={`${user.agent_roster}-${dateStr}`}
                                  className="px-1 py-3 text-center border-l border-gray-300"
                                >
                                  <select
                                    value={attendanceRecord?.attendance_type ? attendanceRecord?.attendance_type : attendanceRecord?.weekend ? 'ddd' : 'x'}
                                    onChange={(e) => handleAttendanceChange(user.agent_roster, dateStr, e.target.value)}
                                    className="w-full px-1 py-1 rounded font-medium text-xs transition-all bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
                                  >
                                    <option value="">-</option>
                                    {attendanceStatuses.map((status) => (
                                      <option key={status.attendance_name} value={status.short_name}>
                                        {status.display.toUpperCase()}
                                      </option>
                                    ))}
                                  </select>
                                </td>

                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={handleSaveAll}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                  >
                    {saving && (
                      <div className="inline-block animate-spin">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    Guardar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TakeAttendance
