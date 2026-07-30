import dayjs from 'dayjs'
import { REPORT_TYPES } from '../constanst'
import { useInconsistenciasContext } from '../context/useInconsistenciasContext'

export const InconsistenciasFilter = () => {
    const {
        reportType,
        startDate,
        endDate,
        loading,
        authenticated,
        authLoading,
        handleStartDateChange,
        handleEndDateChange,
        handleAuthenticate,
        handleSearchReports,
        setReportType,
    } = useInconsistenciasContext()

    return (
        <div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6'>
            <div className='flex flex-wrap items-end gap-6'>
                {/* Tipo de Reporte */}
                <div className='flex flex-col min-w-[200px]'>
                    <label
                        htmlFor='reportType'
                        className='block text-sm font-semibold text-gray-900 mb-2'
                    >
                        Tipo de Reporte
                    </label>
                    <select
                        id='reportType'
                        value={reportType}
                        onChange={e => setReportType(e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                    >
                        {REPORT_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Desde */}
                <div className='flex flex-col'>
                    <label
                        htmlFor='startDate'
                        className='block text-sm font-semibold text-gray-900 mb-2'
                    >
                        Desde
                    </label>
                    <input
                        id='startDate'
                        type='date'
                        value={startDate}
                        max={endDate || undefined}
                        min={
                            endDate
                                ? dayjs(endDate).subtract(7, 'day').format('YYYY-MM-DD')
                                : undefined
                        }
                        onChange={handleStartDateChange}
                        className='px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                    />
                </div>

                {/* Hasta */}
                <div className='flex flex-col'>
                    <label
                        htmlFor='endDate'
                        className='block text-sm font-semibold text-gray-900 mb-2'
                    >
                        Hasta
                    </label>
                    <input
                        id='endDate'
                        type='date'
                        value={endDate}
                        min={startDate || undefined}
                        max={
                            startDate
                                ? dayjs(startDate).add(7, 'day').format('YYYY-MM-DD')
                                : undefined
                        }
                        onChange={handleEndDateChange}
                        className='px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                    />
                </div>

                {/* Buscar reportes Button */}
                <div className='flex flex-col'>
                    <button
                        disabled={loading}
                        onClick={handleSearchReports}
                        className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-sm flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? (
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                        ) : (
                            <svg
                                className='w-4 h-4'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                                />
                            </svg>
                        )}
                        {loading ? 'Buscando...' : 'Buscar reportes'}
                    </button>
                </div>

                {/* Autenticarse Button */}
                <div className='flex flex-col'>
                    <button
                        disabled={authenticated || authLoading}
                        onClick={handleAuthenticate}
                        className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm transition-colors ${
                            authenticated
                                ? 'bg-green-100 text-green-800 border border-green-300 cursor-default'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                    >
                        {authLoading ? (
                            <div className='w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin' />
                        ) : authenticated ? (
                            <svg
                                className='w-4 h-4 text-green-600'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M5 13l4 4L19 7'
                                />
                            </svg>
                        ) : (
                            <svg
                                className='w-4 h-4'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
                                />
                            </svg>
                        )}
                        {authenticated ? 'Autenticado en Omnia' : 'Autenticarse en omnia'}
                    </button>
                </div>
            </div>
        </div>
    )
}
