import { useState, useEffect, useCallback, useRef } from 'react'
import { rrhhApi } from '@/api/rrhh.api'
import { pdfCache } from '../utils/pdfCache'

interface UseCachedPdfReturn {
    pdfUrl: string | null
    loading: boolean
    error: string | null
    isCached: boolean
    reload: () => Promise<void>
}

export const useCachedPdf = (s3Key: string | undefined): UseCachedPdfReturn => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [isCached, setIsCached] = useState<boolean>(false)
    const currentObjectUrlRef = useRef<string | null>(null)

    const cleanupCurrentUrl = () => {
        if (currentObjectUrlRef.current && currentObjectUrlRef.current.startsWith('blob:')) {
            URL.revokeObjectURL(currentObjectUrlRef.current)
            currentObjectUrlRef.current = null
        }
    }

    const loadPdf = useCallback(async (forceRefresh = false) => {
        if (!s3Key) {
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            // 1. Verificar si ya está guardado en IndexedDB local
            if (!forceRefresh) {
                const cachedBlob = await pdfCache.get(s3Key)
                if (cachedBlob && cachedBlob.size > 0) {
                    cleanupCurrentUrl()
                    const blobUrl = URL.createObjectURL(cachedBlob)
                    currentObjectUrlRef.current = blobUrl
                    setPdfUrl(blobUrl)
                    setIsCached(true)
                    setLoading(false)
                    return
                }
            }

            // 2. Si no está en caché, obtener el enlace firmado de S3
            const res = await rrhhApi.getSignedUrl(s3Key)
            const signedUrl = res?.data?.data

            if (!signedUrl) {
                throw new Error('No se pudo generar el enlace de acceso al manual.')
            }

            // 3. Descargar el archivo binario
            let blob: Blob | null = null

            // Usar el proxy local de la aplicación para evitar el error CORS
            const proxyUrl = `/api/manuales/download?url=${encodeURIComponent(signedUrl)}`
            const proxyResponse = await fetch(proxyUrl)
            if (!proxyResponse.ok) {
                throw new Error(`Error en la descarga del manual (${proxyResponse.status})`)
            }
            blob = await proxyResponse.blob()

            // Asegurar que el Blob tenga tipo application/pdf
            const pdfBlob = blob.type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' })

            // 4. Guardar en IndexedDB para futuras aperturas
            await pdfCache.set(s3Key, pdfBlob)

            // 5. Crear Blob URL local para el visor
            cleanupCurrentUrl()
            const blobUrl = URL.createObjectURL(pdfBlob)
            currentObjectUrlRef.current = blobUrl
            setPdfUrl(blobUrl)
            setIsCached(true)
        } catch (err: any) {
            console.error('Error al procesar el manual PDF:', err)
            setError(err?.message || 'Ocurrió un error al cargar el manual')
        } finally {
            setLoading(false)
        }
    }, [s3Key])

    useEffect(() => {
        loadPdf()

        return () => {
            cleanupCurrentUrl()
        }
    }, [loadPdf])

    const reload = async () => {
        if (s3Key) {
            await pdfCache.delete(s3Key)
        }
        await loadPdf(true)
    }

    return {
        pdfUrl,
        loading,
        error,
        isCached,
        reload,
    }
}
