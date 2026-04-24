import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { coachingSessionApi } from '@/api/coachingSession.api'
import Icons from '@/utils/icons'

export const FileLink = ({ file }: { file: string }) => {
    const [loading, setLoading] = useState(false)

    const handleClick = useCallback(async () => {
        if (loading) return

        try {
            setLoading(true)
            const link = (await coachingSessionApi.getSignatures(file)).data

            if (!link) {
                toast.error('No se pudo obtener el enlace del archivo.')
                return
            }
            const a = document.createElement('a')
            a.href = link
            a.target = '_blank'
            a.rel = 'noreferrer'
            a.click()
        } catch (error) {
            toast.error('Ocurrió un error al intentar abrir el archivo. Intenta de nuevo.' + error)
        } finally {
            setLoading(false)
        }
    }, [file, loading])

    return (
        <span
            role='button'
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleClick()}
            className={`text-blue-500 hover:underline cursor-pointer transition-opacity ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={loading ? 'Cargando...' : 'Abrir archivo'}
        >
            {loading ? <Icons.FaSpinner /> : <Icons.FaFileAlt />}
        </span>
    )
}
