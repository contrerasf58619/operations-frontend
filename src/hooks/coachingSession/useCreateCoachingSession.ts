import { useState, useCallback } from 'react'
import { coachingSessionApi, CoachingSession } from '@/api/coachingSession.api'
import { toast } from 'react-toastify'

export const useCreateCoachingSession = () => {
    const [saving, setSaving] = useState(false)

    const createCoachingSession = useCallback(async (data: CoachingSession) => {
        try {
            setSaving(true)
            const res = await coachingSessionApi.createCoachingSession(data)
            toast.success('Sesión de coaching creada correctamente')
            return res.data
        } catch (err) {
            console.error('Error creating coaching session', err)
            toast.error('No se pudo crear la sesión de coaching')
            throw err
        } finally {
            setSaving(false)
        }
    }, [])

    return {
        saving,
        createCoachingSession,
    }
}
