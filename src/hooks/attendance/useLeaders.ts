import { useState, useEffect } from 'react'
import { attendanceApi } from '@/api'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { Leader } from '@/interfaces/takeAttendance.interface'

export const useLeaders = (selectedUad: string, startDate: string, endDate: string, employeeCode: string | undefined) => {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [selectedLeader, setSelectedLeader] = useState<string>('')
  const [loadingLeaders, setLoadingLeaders] = useState(false)

  useEffect(() => {
    setSelectedLeader('')
    setLeaders([])
  }, [selectedUad])

  useEffect(() => {
    if (!selectedUad || !startDate || !endDate || !employeeCode) {
      setLeaders([])
      return
    }

    setLoadingLeaders(true)
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
        if (currentLeader) {
          setSelectedLeader(currentLeader.sup_code)
        }
        if (data.length > 0 && !currentLeader) {
          setSelectedLeader(data[0].sup_code)
        }
      })
      .catch((err) => {
        console.error('Error fetching leaders', err)
        toast.error('No se pudo cargar la lista de líderes')
      })
      .finally(() => setLoadingLeaders(false))
  }, [selectedUad, startDate, endDate, employeeCode])

  return {
    leaders,
    selectedLeader,
    setSelectedLeader,
    loadingLeaders,
  }
}
