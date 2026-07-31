'use client'

import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { UadList } from '@/components/catalogs/UadList'
import { DataTable } from '@/components/UI/DataTable'
import { Tabs, Tab } from '@/components/UI/Tabs'
import { PayrollBeforeDatesSelector } from '@/components/UI/PayrollBeforeDatesSelector'
import {
    columnsExtrasDDD,
    columnsExtrasSimples,
    columnsExtrasWp,
    // columnsRecargoNocturno,
    columnsTotalExtrasSimples,
} from './columns'
import {
    useExtrasSimplesAlerts,
    useExtrasDDDAlerts,
    useExtrasWpAlerts,
    useTotalExtrasSimplesAlerts,
} from '@/hooks/useAlerts'

export const getPercentageColor = (porcentaje: number) => {
    if (porcentaje <= 10) return 'text-green-600 bg-green-50'
    if (porcentaje > 10 && porcentaje <= 15) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
}

const Quincenal: React.FC = () => {
    const [selectedUad, setSelectedUad] = useState<number>(0)
    const [selectedNomina, setSelectedNomina] = useState<number>(0)

    const [activeTab, setActiveTab] = useState<
        'extras-simples' | 'ddd-asuetos' | 'extras-wp' | 'total-extras-simples' | 'extras-nocturno'
    >('extras-simples')

    useEffect(() => {
        setSelectedNomina(0)
    }, [selectedUad])

    const { alerts: alertDataExtraSimples, loading: loadingAlertsSimples } = useExtrasSimplesAlerts(
        selectedUad && selectedNomina ? { uadId: selectedUad, idPayroll: selectedNomina } : null,
    )

    const { alerts: alertsDataExtrasDdd, loading: loadingAlertExtrasDDD } = useExtrasDDDAlerts(
        selectedUad && selectedNomina ? { uadId: selectedUad, idPayroll: selectedNomina } : null,
    )

    const { alerts: alertsDataExtrasWp, loading: loadingAlertExtrasWp } = useExtrasWpAlerts(
        selectedUad && selectedNomina ? { uadId: selectedUad, idPayroll: selectedNomina } : null,
    )

    const { alerts: alertsDataTotalExtrasSimples, loading: loadingAlertsTotalExtrasSimples } =
        useTotalExtrasSimplesAlerts(
            selectedUad && selectedNomina
                ? { uadId: selectedUad, idPayroll: selectedNomina }
                : null,
        )

    const showTable = selectedUad !== 0 && selectedNomina !== 0 && !loadingAlertsSimples

    return (
        <div className='p-6 min-h-screen'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-4xl font-bold mb-2 text-gray-900'>Quincenal</h1>
                <p className='text-gray-600 mb-8'>
                    Consulta la data quincenal de los empleados por UAD y nómina
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
                {loadingAlertsSimples &&
                    loadingAlertExtrasDDD &&
                    loadingAlertExtrasWp &&
                    loadingAlertsTotalExtrasSimples && (
                        <div className='flex justify-center my-8'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                        </div>
                    )}

                {/* Tabs and Data Table */}
                {/* Tabs */}
                {showTable && (
                    <div className='mt-2'>
                        <Tabs activeTab={activeTab} onChange={id => setActiveTab(id as any)}>
                            <Tab id='extras-simples' label='Extras simples'>
                                <DataTable
                                    data={alertDataExtraSimples}
                                    columns={columnsExtrasSimples}
                                    searchPlaceholder='Buscar roster, semana, etc...'
                                    noDataText='No se encontraron alertas de horas extra.'
                                />
                            </Tab>

                            <Tab id='ddd-asuetos' label='Extras DDD'>
                                <DataTable
                                    data={alertsDataExtrasDdd}
                                    columns={columnsExtrasDDD}
                                    searchPlaceholder='Buscar roster, semana, etc...'
                                    noDataText='No se encontraron alertas de horas extra.'
                                />
                            </Tab>

                            <Tab id='extras-wp' label='Extras WP'>
                                <DataTable
                                    data={alertsDataExtrasWp}
                                    columns={columnsExtrasWp}
                                    searchPlaceholder='Buscar roster, semana, etc...'
                                    noDataText='No se encontraron alertas de horas extra.'
                                />
                            </Tab>

                            <Tab id='total-extras-simples' label='Total Extras Simples'>
                                <DataTable
                                    data={alertsDataTotalExtrasSimples}
                                    columns={columnsTotalExtrasSimples}
                                    searchPlaceholder='Buscar roster, semana, etc...'
                                    noDataText='No se encontraron alertas de horas extra.'
                                />
                            </Tab>

                            {/* <Tab id='extras-nocturno' label='Extras Nocturno'>
                                <DataTable
                                    data={alertsDataWorkDay}
                                    columns={columnsTotalExtrasSimples}
                                    searchPlaceholder='Buscar roster, semana, etc...'
                                    noDataText='No se encontraron alertas de horas extra.'
                                />
                            </Tab> */}
                        </Tabs>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Quincenal
