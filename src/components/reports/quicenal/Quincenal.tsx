'use client'

import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { ColumnDef } from '@tanstack/react-table'
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

type QuincenalTab =
    | 'extras-simples'
    | 'ddd-asuetos'
    | 'extras-wp'
    | 'total-extras-simples'
    | 'extras-nocturno'

export const getPercentageColor = (porcentaje: number) => {
    if (porcentaje <= 10) return 'text-green-600 bg-green-50'
    if (porcentaje > 10 && porcentaje <= 15) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
}

interface VariationPanelProps<TData> {
    loading: boolean
    error?: unknown
    data: TData[]
    columns: ColumnDef<TData, any>[]
}

/**
 * Cada tab resuelve su propio estado: los cuatro endpoints se consultan en
 * paralelo y no tienen por que terminar al mismo tiempo, asi que un spinner
 * global dejaria tabs ya listos escondidos detras del mas lento.
 */
function VariationPanel<TData>({ loading, error, data, columns }: VariationPanelProps<TData>) {
    if (loading) {
        return (
            <div className='flex justify-center my-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' />
            </div>
        )
    }

    if (error) {
        return (
            <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-600'>
                Ocurrió un error al cargar la información. Intenta de nuevo.
            </div>
        )
    }

    return (
        <DataTable
            data={data}
            columns={columns}
            searchPlaceholder='Buscar cuenta...'
            noDataText='No se encontraron variaciones para esta quincena.'
        />
    )
}

const Quincenal: React.FC = () => {
    const [selectedUad, setSelectedUad] = useState<number>(0)
    const [selectedNomina, setSelectedNomina] = useState<number>(0)

    const [activeTab, setActiveTab] = useState<QuincenalTab>('extras-simples')

    useEffect(() => {
        setSelectedNomina(0)
    }, [selectedUad])

    const payload =
        selectedUad && selectedNomina ? { uadId: selectedUad, idPayroll: selectedNomina } : null

    const {
        alerts: alertDataExtraSimples,
        loading: loadingAlertsSimples,
        error: errorAlertsSimples,
    } = useExtrasSimplesAlerts(payload)

    const {
        alerts: alertsDataExtrasDdd,
        loading: loadingAlertExtrasDDD,
        error: errorAlertExtrasDDD,
    } = useExtrasDDDAlerts(payload)

    const {
        alerts: alertsDataExtrasWp,
        loading: loadingAlertExtrasWp,
        error: errorAlertExtrasWp,
    } = useExtrasWpAlerts(payload)

    const {
        alerts: alertsDataTotalExtrasSimples,
        loading: loadingAlertsTotalExtrasSimples,
        error: errorAlertsTotalExtrasSimples,
    } = useTotalExtrasSimplesAlerts(payload)

    const showTable = selectedUad !== 0 && selectedNomina !== 0

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

                {/* Tabs and Data Table */}
                {showTable && (
                    <div className='mt-2'>
                        <Tabs
                            activeTab={activeTab}
                            onChange={id => setActiveTab(id as QuincenalTab)}
                        >
                            <Tab id='extras-simples' label='Extras simples'>
                                <VariationPanel
                                    loading={loadingAlertsSimples}
                                    error={errorAlertsSimples}
                                    data={alertDataExtraSimples}
                                    columns={columnsExtrasSimples}
                                />
                            </Tab>

                            <Tab id='ddd-asuetos' label='Extras DDD'>
                                <VariationPanel
                                    loading={loadingAlertExtrasDDD}
                                    error={errorAlertExtrasDDD}
                                    data={alertsDataExtrasDdd}
                                    columns={columnsExtrasDDD}
                                />
                            </Tab>

                            <Tab id='extras-wp' label='Extras WP'>
                                <VariationPanel
                                    loading={loadingAlertExtrasWp}
                                    error={errorAlertExtrasWp}
                                    data={alertsDataExtrasWp}
                                    columns={columnsExtrasWp}
                                />
                            </Tab>

                            <Tab id='total-extras-simples' label='Total Extras Simples'>
                                <VariationPanel
                                    loading={loadingAlertsTotalExtrasSimples}
                                    error={errorAlertsTotalExtrasSimples}
                                    data={alertsDataTotalExtrasSimples}
                                    columns={columnsTotalExtrasSimples}
                                />
                            </Tab>

                            {/* Pendiente: el endpoint de recargo nocturno aun no existe en el backend.
                            <Tab id='extras-nocturno' label='Extras Nocturno'>
                                <VariationPanel
                                    loading={loadingRecargoNocturno}
                                    error={errorRecargoNocturno}
                                    data={alertsDataRecargoNocturno}
                                    columns={columnsRecargoNocturno}
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
