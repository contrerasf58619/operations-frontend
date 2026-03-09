import { useState, useCallback, useEffect } from 'react'
import { AttendanceRecord, AttendanceUser, AttendanceLeader } from '@/interfaces'
import dayjs, { Dayjs } from 'dayjs'

export const useAttendance = (startDate: string, endDate: string) => {
  const [attendance, setAttendance] = useState<AttendanceRecord>({})
  const [users, setUsers] = useState<AttendanceUser[]>([])
  const [leaders, setLeaders] = useState<AttendanceLeader[]>([])
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize leaders
  useEffect(() => {
    const initializeLeaders = () => {
      const simulatedLeaders: AttendanceLeader[] = [
        { id: '1', name: 'Fredy contreras' },
        { id: '2', name: 'Juan Perez' },
        { id: '3', name: 'Guillermo soto' },
        { id: '4', name: 'Javier Lopez' },
        { id: '5', name: 'Rene Zelada' },
      ]
      setLeaders(simulatedLeaders)
    }

    initializeLeaders()
  }, [])

  // Load users for a selected leader
  const loadUsersByLeader = useCallback((leaderId: string) => {
    setLoading(true)
    // Simulated API call - replace with actual API
    const timer = setTimeout(() => {
      const simulatedUsers: AttendanceUser[] = [
        { id: 'u1', name: 'Javier Lopez', department: 'Operations' },
        { id: 'u2', name: 'Rene Zelada', department: 'Operations' },
        { id: 'u3', name: 'Pedro García', department: 'Operations' },
        { id: 'u4', name: 'Carlos Ruiz', department: 'Maintenance' },
        { id: 'u5', name: 'María Sánchez', department: 'Administration' },
        { id: 'u6', name: 'Ana Rodriguez', department: 'Operations' },
      ]

      setUsers(simulatedUsers)

      // Initialize attendance records
      const newAttendance: AttendanceRecord = {}
      simulatedUsers.forEach((user) => {
        newAttendance[user.id] = {
          userId: user.id,
          userName: user.name,
          entries: {},
        }
      })
      setAttendance(newAttendance)
      setHasChanges(false)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Get dates in range
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

  // Update attendance entry
  const updateAttendanceEntry = useCallback(
    (userId: string, date: string, status: string) => {
      setAttendance((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          entries: {
            ...prev[userId].entries,
            [date]: status,
          },
        },
      }))
      setHasChanges(true)
    },
    [],
  )

  // Clear all attendance
  const clearAllAttendance = useCallback(() => {
    const newAttendance: AttendanceRecord = {}
    users.forEach((user) => {
      newAttendance[user.id] = {
        userId: user.id,
        userName: user.name,
        entries: {},
      }
    })
    setAttendance(newAttendance)
    setHasChanges(false)
  }, [users])

  return {
    attendance,
    users,
    leaders,
    loading,
    hasChanges,
    loadUsersByLeader,
    getDatesInRange,
    updateAttendanceEntry,
    clearAllAttendance,
  }
}
