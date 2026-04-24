import { useState, useCallback } from 'react'
import { coachingSessionApi } from '@/api/coachingSession.api'
import { toast } from 'react-toastify'

export const useUploadAttachment = () => {
    const [uploading, setUploading] = useState(false)

    const uploadAttachment = useCallback(async (files: FileList) => {
        try {
            setUploading(true)
            const res = await coachingSessionApi.uploadAttachment(files)
            toast.success('Archivo adjunto subido correctamente')
            return res
        } catch (err) {
            console.error('Error uploading attachment', err)
            toast.error('No se pudo subir el archivo adjunto')
            throw err
        } finally {
            setUploading(false)
        }
    }, [])

    return {
        uploading,
        uploadAttachment,
    }
}
