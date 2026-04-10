'use client'

import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { UadList } from '../../catalogs/UadList'
import { DataTable } from '../../UI/DataTable'
import { Tabs, Tab } from '../../UI/Tabs'
import { PayrollBeforeDatesSelector } from '../../UI/PayrollBeforeDatesSelector'
import { useHoursOnTheWorkday, useHoursOnVacation, useOvertimeAlerts } from '@/hooks/useAlerts'
import { columnsUpdate, columnsVacations, columnsWorkday } from './columns'

export const getPercentageColor = (porcentaje: number) => {
    if (porcentaje <= 10) return 'text-green-600 bg-green-50'
    if (porcentaje > 10 && porcentaje <= 15) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
}

const AlertsReport: React.FC = () => {
    const [selectedUad, setSelectedUad] = useState<number>(0)
    const [selectedNomina, setSelectedNomina] = useState<number>(0)

    const [activeTab, setActiveTab] = useState<'extras' | 'asueto' | 'jornada'>('extras')

    useEffect(() => {
        setSelectedNomina(0)
    }, [selectedUad])

    const { alerts: alertsData, loading: loadingAlerts } = useOvertimeAlerts(
        selectedUad && selectedNomina ? { uadId: selectedUad, idPayroll: selectedNomina } : null,
    )

    const { alerts: alertsDataWorkDay, loading: loadingAlertsWorkDay } = useHoursOnTheWorkday(
        selectedUad && selectedNomina ? { uadId: selectedUad, idPayroll: selectedNomina } : null,
    )

    const { alerts: alertsDataVacation, loading: loadingAlertsVacation } = useHoursOnVacation(
        selectedUad && selectedNomina ? { uadId: selectedUad, idPayroll: selectedNomina } : null,
    )

    const showTable = selectedUad !== 0 && selectedNomina !== 0 && !loadingAlerts

    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-4xl font-bold mb-2 text-gray-900'>Alertas</h1>
                <p className='text-gray-600 mb-8'>
                    Consulta las alertas de tiempo productivo y extras por roster
                </p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                    {/* UAD Selector */}
                    <div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                        <label
                            htmlFor='uad'
                            className='block text-sm font-semibold text-gray-900 mb-4'
                        >
                            UAD
                        </label>
                        <div className='space-y-4'>
                            <UadList
                                allUads={true}
                                value={selectedUad}
                                onChange={v => setSelectedUad(Number(v))}
                            />
                        </div>
                    </div>

                    {/* Nómina Selector */}
                    <div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                        <label
                            htmlFor='payroll'
                            className='block text-sm font-semibold text-gray-900 mb-4'
                        >
                            Periodo de Nómina
                        </label>
                        <div className='space-y-4'>
                            <PayrollBeforeDatesSelector
                                uadId={selectedUad}
                                date={Number(dayjs().format('YYYYMMDD'))}
                                value={selectedNomina}
                                onChange={setSelectedNomina}
                                disabled={!selectedUad}
                            />
                        </div>
                    </div>
                </div>

                {/* Loading Indicator for Table */}
                {loadingAlerts && loadingAlertsWorkDay && loadingAlertsVacation && (
                    <div className='flex justify-center my-8'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                    </div>
                )}

                {/* Tabs and Data Table */}
                {showTable && (
                    <div className='mt-2'>
                        {/* Tabs */}
                        <Tabs activeTab={activeTab} onChange={id => setActiveTab(id as any)}>
                            <Tab id='extras' label='Horas extras'>
                                <DataTable
                                    data={alertsData}
                                    columns={columnsUpdate}
                                    searchPlaceholder='Buscar roster, semana, etc...'
                                    noDataText='No se encontraron alertas de horas extra.'
                                />
                            </Tab>

                            <Tab id='asueto' label='Horas en asueto'>
                                <DataTable
                                    data={alertsDataVacation}
                                    columns={columnsVacations}
                                    searchPlaceholder='Buscar roster, semana, etc...'
                                    noDataText='No se encontraron alertas de horas extra.'
                                />
                            </Tab>

                            <Tab id='jornada' label='Horas jornada'>
                                <DataTable
                                    data={alertsDataWorkDay}
                                    columns={columnsWorkday}
                                    searchPlaceholder='Buscar roster, semana, etc...'
                                    noDataText='No se encontraron alertas de horas extra.'
                                />
                            </Tab>
                        </Tabs>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AlertsReport
