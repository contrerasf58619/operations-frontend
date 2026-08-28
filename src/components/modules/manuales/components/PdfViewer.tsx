import React, { useEffect } from 'react'
import { Manual } from '../interfaces/manual.interface'
import { LuArrowLeft, LuCircleAlert, LuLoaderCircle, LuRefreshCw, LuX, LuZap } from 'react-icons/lu'
import { useCachedPdf } from '../hooks/useCachedPdf'

interface PdfViewerProps {
    manual: Manual
    onClose: () => void
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ manual, onClose }) => {
    const { pdfUrl, loading, error, isCached, reload } = useCachedPdf(manual?.path)

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4'
            style={{ animation: 'pdfModalFadeIn 0.2s ease-out' }}
        >
            {/* Backdrop */}
            <button
                type='button'
                aria-label='Cerrar visualizador'
                className='absolute inset-0 bg-black/60 backdrop-blur-sm w-full h-full border-0 cursor-default'
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className='relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full h-full max-w-[98vw] max-h-[96vh]'
                style={{
                    animation: 'pdfModalSlideUp 0.25s ease-out',
                }}
            >
                {/* Viewer Header */}
                <div className='bg-gradient-to-r from-gray-900 to-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4 shrink-0'>
                    <div className='flex items-center gap-3 sm:gap-4 min-w-0'>
                        <button
                            onClick={onClose}
                            className='flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium cursor-pointer shrink-0'
                        >
                            <LuArrowLeft className='w-4 h-4' />
                            <span className='hidden sm:inline'>Volver</span>
                        </button>
                        <div className='w-px h-6 bg-gray-600 shrink-0' />
                        <div className='min-w-0'>
                            <div className='flex items-center gap-2 flex-wrap'>
                                <h2 className='text-white font-bold text-sm sm:text-base truncate'>
                                    {manual.name}
                                </h2>
                                {isCached && !loading && (
                                    <span
                                        className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        title='Documento cargado desde la memoria caché del navegador'
                                    >
                                        <LuZap className='w-3 h-3 text-emerald-400' />
                                        En caché
                                    </span>
                                )}
                            </div>
                            <span className='text-gray-400 text-xs block truncate'>
                                {manual.category}
                            </span>
                        </div>
                    </div>

                    <div className='flex items-center gap-1 sm:gap-2 shrink-0'>
                        <button
                            onClick={onClose}
                            className='p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all cursor-pointer'
                            title='Cerrar'
                        >
                            <LuX className='w-5 h-5' />
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className='flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center'>
                    {loading && (
                        <div className='flex flex-col items-center justify-center gap-4 text-center p-6 animate-pulse'>
                            <div className='p-4 bg-white rounded-2xl shadow-sm border border-gray-200'>
                                <LuLoaderCircle className='w-10 h-10 text-blue-600 animate-spin' />
                            </div>
                            <div>
                                <h3 className='text-base font-semibold text-gray-800'>
                                    Cargando documento...
                                </h3>
                                <p className='text-sm text-gray-500 mt-1 max-w-sm'>
                                    {isCached
                                        ? 'Recuperando manual desde el almacenamiento local...'
                                        : 'Descargando y preparando el manual para guardarlo en caché...'}
                                </p>
                            </div>
                        </div>
                    )}

                    {!loading && error && (
                        <div className='flex flex-col items-center justify-center gap-3 text-center p-6 max-w-md'>
                            <div className='p-3 bg-red-100 text-red-600 rounded-full'>
                                <LuCircleAlert className='w-8 h-8' />
                            </div>
                            <h3 className='text-base font-semibold text-gray-800'>
                                No se pudo cargar el manual
                            </h3>
                            <p className='text-sm text-gray-500'>{error}</p>
                            <button
                                onClick={reload}
                                className='mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-all cursor-pointer shadow-sm'
                            >
                                <LuRefreshCw className='w-4 h-4' />
                                Reintentar
                            </button>
                        </div>
                    )}

                    {!loading && !error && pdfUrl && (
                        <iframe
                            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            title={manual.name}
                            className='w-full h-full border-0'
                        />
                    )}
                </div>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes pdfModalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes pdfModalSlideUp {
                    from { opacity: 0; transform: scale(0.97) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    )
}
