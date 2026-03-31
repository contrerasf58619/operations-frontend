import { useState, useEffect } from 'react'
import { attendanceApi } from '@/api'
import { toast } from 'react-toastify'
import { AttendanceType } from '@/interfaces/takeAttendance.interface'

export const useAttendanceTypes = (selectedUad: string) => {
    const [attendanceStatuses, setAttendanceStatuses] = useState<AttendanceType[]>([])

    useEffect(() => {
        if (!selectedUad) {
            setAttendanceStatuses([])
            return
        }
        attendanceApi
            .getAttendanceTypes({ uadId: selectedUad })
            .then(res => {
                setAttendanceStatuses(res.data || [])
            })
            .catch(err => {
                console.error('Error fetching attendance types', err)
                toast.error('Error al cargar tipos de asistencia')
            })
    }, [selectedUad])

    return { attendanceStatuses }
}
