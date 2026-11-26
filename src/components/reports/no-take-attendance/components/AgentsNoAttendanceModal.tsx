import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useNoTakeAttendanceContext } from '../context/useNoTakeAttendanceContext'

export const AgentsNoAttendanceModal = () => {
    const { selectedSupervisor, agentsNoAttendance, loadingAgents, handleCloseSupervisorDetail } =
        useNoTakeAttendanceContext()

    const [search, setSearch] = useState('')

    useEffect(() => {
        setSearch('')
    }, [selectedSupervisor])

    useEffect(() => {
        if (!selectedSupervisor) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleCloseSupervisorDetail()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedSupervisor, handleCloseSupervisorDetail])

    const filteredAgents = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return agentsNoAttendance

        return agentsNoAttendance.filter(
            item =>
                String(item.agent_code ?? '')
                    .toLowerCase()
                    .includes(query) || (item.agente ?? '').toLowerCase().includes(query),
        )
    }, [agentsNoAttendance, search])

    if (!selectedSupervisor) return null

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            role='dialog'
            aria-modal='true'
            aria-labelledby='agents-no-attendance-modal-title'
        >
            <button
                type='button'
                aria-label='Cerrar modal'
                tabIndex={-1}
                onClick={handleCloseSupervisorDetail}
                className='absolute inset-0 bg-gray-900/50 cursor-default'
            />
            <div className='relative z-10 w-full max-w-3xl rounded-xl bg-white shadow-xl border border-gray-200 flex flex-col max-h-[85vh]'>
                <div className='flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-200'>
                    <div>
                        <h3
                            id='agents-no-attendance-modal-title'
                            className='text-lg font-semibold text-gray-900'
                        >
                            Agentes sin asistencia
                        </h3>
                        <p className='text-sm text-gray-500 mt-0.5'>
                            Supervisor:{' '}
                            <span className='font-medium text-gray-700'>
                                {selectedSupervisor.name}
                            </span>{' '}
                            <span className='text-gray-400'>({selectedSupervisor.sup_code})</span>
                        </p>
                    </div>
                    <button
                        type='button'
                        onClick={handleCloseSupervisorDetail}
                        aria-label='Cerrar modal'
                        className='text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1.5 transition-colors cursor-pointer'
                    >
                        <svg
                            className='w-5 h-5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M6 18L18 6M6 6l12 12'
                            />
                        </svg>
                    </button>
                </div>

                <div className='flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-gray-100 bg-gray-50/50'>
                    <div className='relative w-full max-w-sm'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <svg
                                className='h-4 w-4 text-gray-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                                />
                            </svg>
                        </div>
                        <input
                            type='text'
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder='Buscar por código o agente...'
                            className='pl-9 pr-3 py-2 border border-gray-200 rounded-lg w-full bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        />
                    </div>
                    <div className='px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 font-medium'>
                        Registros:{' '}
                        <span className='font-semibold text-gray-900'>{filteredAgents.length}</span>
                    </div>
                </div>

                <div className='overflow-auto flex-1'>
                    <table className='w-full border-collapse'>
                        <thead className='sticky top-0 z-10'>
                            <tr className='border-b-2 border-gray-200 bg-gray-100'>
                                <th className='text-sm font-semibold text-gray-700 px-4 py-2.5 text-left border-r border-gray-200 whitespace-nowrap'>
                                    Código
                                </th>
                                <th className='text-sm font-semibold text-gray-700 px-4 py-2.5 text-left border-r border-gray-200 whitespace-nowrap'>
                                    Agente
                                </th>
                                <th className='text-sm font-semibold text-gray-700 px-4 py-2.5 text-left whitespace-nowrap'>
                                    Fecha sin asistencia
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {loadingAgents ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className='px-6 py-12 text-center text-sm text-gray-500'
                                    >
                                        <div className='flex flex-col items-center gap-3'>
                                            <div className='w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
                                            <p className='font-medium text-gray-600'>
                                                Cargando agentes...
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredAgents.length > 0 ? (
                                filteredAgents.map((item, index) => (
                                    <tr
                                        key={`${item.agent_code}-${item.fecha_sin_asistencia}-${index}`}
                                        className='hover:bg-blue-50/50 transition-colors'
                                    >
                                        <td className='px-4 py-2.5 text-sm text-gray-700 border-r border-gray-100 whitespace-nowrap'>
                                            {item.agent_code}
                                        </td>
                                        <td className='px-4 py-2.5 text-sm text-gray-700 border-r border-gray-100'>
                                            {item.agente}
                                        </td>
                                        <td className='px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap'>
                                            {item.fecha_sin_asistencia
                                                ? dayjs(item.fecha_sin_asistencia)
                                                      .utc()
                                                      .format('DD/MM/YYYY')
                                                : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className='px-6 py-12 text-center text-sm text-gray-400'
                                    >
                                        No se encontraron registros de agentes sin asistencia
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className='flex justify-end px-6 py-3 border-t border-gray-200 bg-gray-50/50 rounded-b-xl'>
                    <button
                        type='button'
                        onClick={handleCloseSupervisorDetail}
                        className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}
