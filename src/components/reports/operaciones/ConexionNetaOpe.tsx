import React from 'react'

export const ConexionNetaOpe = () => {
    return (
        <>
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
                    <div>
                        <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
                            Consolidated Weekly Connection
                        </h1>
                        <p className='text-slate-500 dark:text-slate-400 text-sm mt-1'>
                            Review and manage employee connection hours across rosters.
                        </p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <button className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all'>
                            <span className='material-symbols-outlined text-lg'>download</span>
                            Export CSV
                        </button>
                        <button className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-indigo-700 transition-all shadow-sm'>
                            <span className='material-symbols-outlined text-lg'>add</span>
                            New Entry
                        </button>
                    </div>
                </div>
                <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm'>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-left border-collapse'>
                            <thead>
                                <tr className='bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800'>
                                    <th className='px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider'>
                                        Roster
                                    </th>
                                    <th className='px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider'>
                                        Fecha
                                    </th>
                                    <th className='px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider'>
                                        Horario
                                    </th>
                                    <th className='px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider'>
                                        Conexión Neta
                                    </th>
                                    <th className='px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-center border-l border-slate-200 dark:border-slate-800'>
                                        Conexión Neta Semanal
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
                                <tr className='hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors'>
                                    <td className='px-6 py-4 text-sm font-medium text-slate-900 dark:text-white'>
                                        1
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        27/10/2023
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        08:00 - 17:00
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono'>
                                        4.00
                                    </td>
                                    <td
                                        className='px-6 py-4 text-center border-l border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10'
                                        rowSpan={6}
                                    >
                                        <div className='flex flex-col items-center justify-center h-full'>
                                            <span className='text-3xl font-bold text-primary'>
                                                24.00
                                            </span>
                                            <span className='text-xs uppercase tracking-tighter font-semibold text-slate-400 dark:text-slate-500 mt-1'>
                                                Total Horas
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className='hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors'>
                                    <td className='px-6 py-4 text-sm font-medium text-slate-900 dark:text-white'>
                                        1
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        28/10/2023
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        08:00 - 17:00
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono'>
                                        4.00
                                    </td>
                                </tr>
                                <tr className='hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors'>
                                    <td className='px-6 py-4 text-sm font-medium text-slate-900 dark:text-white'>
                                        1
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        29/10/2023
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        08:00 - 17:00
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono'>
                                        4.00
                                    </td>
                                </tr>
                                <tr className='hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors'>
                                    <td className='px-6 py-4 text-sm font-medium text-slate-900 dark:text-white'>
                                        1
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        30/10/2023
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        08:00 - 17:00
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono'>
                                        4.00
                                    </td>
                                </tr>
                                <tr className='hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors'>
                                    <td className='px-6 py-4 text-sm font-medium text-slate-900 dark:text-white'>
                                        1
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        31/10/2023
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        08:00 - 17:00
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono'>
                                        4.00
                                    </td>
                                </tr>
                                <tr className='hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors border-b-2 border-slate-100 dark:border-slate-800'>
                                    <td className='px-6 py-4 text-sm font-medium text-slate-900 dark:text-white'>
                                        1
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        01/11/2023
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        08:00 - 17:00
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono'>
                                        4.00
                                    </td>
                                </tr>
                                <tr className='hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors'>
                                    <td className='px-6 py-4 text-sm font-medium text-slate-900 dark:text-white'>
                                        2
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        27/10/2023
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        14:00 - 22:00
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono'>
                                        8.00
                                    </td>
                                    <td
                                        className='px-6 py-4 text-center border-l border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10'
                                        rowSpan={3}
                                    >
                                        <div className='flex flex-col items-center justify-center h-full'>
                                            <span className='text-3xl font-bold text-primary'>
                                                24.00
                                            </span>
                                            <span className='text-xs uppercase tracking-tighter font-semibold text-slate-400 dark:text-slate-500 mt-1'>
                                                Total Horas
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className='hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors'>
                                    <td className='px-6 py-4 text-sm font-medium text-slate-900 dark:text-white'>
                                        2
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        28/10/2023
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        14:00 - 22:00
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono'>
                                        8.00
                                    </td>
                                </tr>
                                <tr className='hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors'>
                                    <td className='px-6 py-4 text-sm font-medium text-slate-900 dark:text-white'>
                                        2
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        29/10/2023
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                                        14:00 - 22:00
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono'>
                                        8.00
                                    </td>
                                </tr>
                                <tr className='bg-slate-50 dark:bg-slate-800/80 font-semibold border-t-2 border-slate-200 dark:border-slate-700'>
                                    <td
                                        className='px-6 py-4 text-sm text-slate-900 dark:text-white text-right uppercase tracking-wider'
                                        colSpan={3}
                                    >
                                        Total Consolidado General
                                    </td>
                                    <td className='px-6 py-4 text-sm text-slate-900 dark:text-white font-mono'>
                                        56.00
                                    </td>
                                    <td className='px-6 py-4 text-center border-l border-slate-200 dark:border-slate-800 text-primary'>
                                        48.00
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between'>
                        <p className='text-sm text-slate-500 dark:text-slate-400'>
                            Mostrando
                            <span className='font-medium text-slate-900 dark:text-white'>1</span> a
                            <span className='font-medium text-slate-900 dark:text-white'>9</span> de
                            <span className='font-medium text-slate-900 dark:text-white'>42</span>
                            resultados
                        </p>
                        <div className='flex gap-2'>
                            <button
                                className='px-3 py-1 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50'
                                disabled={true}
                            >
                                Anterior
                            </button>
                            <button className='px-3 py-1 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800'>
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
                <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-6 rounded-xl'>
                        <div className='flex items-center gap-3 mb-2'>
                            <span className='material-symbols-outlined text-indigo-600 dark:text-indigo-400'>
                                info
                            </span>
                            <h3 className='font-semibold text-indigo-900 dark:text-indigo-300'>
                                Resumen Semanal
                            </h3>
                        </div>
                        <p className='text-sm text-indigo-800/80 dark:text-indigo-400/80 leading-relaxed'>
                            Las celdas combinadas representan el total de horas de conexión
                            acumuladas por el roster durante el ciclo semanal configurado.
                        </p>
                    </div>
                    <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='font-semibold text-slate-900 dark:text-white'>
                                Eficiencia
                            </h3>
                            <span className='text-green-500 text-xs font-bold bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-full'>
                                +12%
                            </span>
                        </div>
                        <div className='w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2'>
                            <div
                                className='bg-primary h-2 rounded-full'
                                style={{ width: '78%' }}
                            ></div>
                        </div>
                        <span className='text-xs text-slate-500 dark:text-slate-400'>
                            78% de cobertura de horario vs meta
                        </span>
                    </div>
                    <div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm'>
                        <h3 className='font-semibold text-slate-900 dark:text-white mb-4'>
                            Próximo Reporte
                        </h3>
                        <div className='flex items-center gap-4'>
                            <div className='flex-shrink-0 bg-slate-100 dark:bg-slate-800 h-10 w-10 rounded flex items-center justify-center'>
                                <span className='material-symbols-outlined text-slate-500'>
                                    event_repeat
                                </span>
                            </div>
                            <div>
                                <p className='text-sm font-medium text-slate-900 dark:text-white'>
                                    Lunes, 06 Nov
                                </p>
                                <p className='text-xs text-slate-500 dark:text-slate-400'>
                                    Generación automática
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
