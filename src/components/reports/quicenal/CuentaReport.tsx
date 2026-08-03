'use client'

import React, { useState } from 'react'
import { Tabs, Tab } from '@/components/UI/Tabs'
import { OvertimePayload } from '@/api/alerts.api'
import { VariationPanel } from './shared'
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

type CuentaTab =
    | 'extras-simples'
    | 'ddd-asuetos'
    | 'extras-wp'
    | 'total-extras-simples'
    | 'extras-nocturno'

interface CuentaReportProps {
    /** `null` mientras no haya UAD y nómina seleccionadas: los hooks no disparan. */
    payload: OvertimePayload | null
}

/**
 * Variación quincenal agrupada por CUENTA: una fila por cliente.
 *
 * Backend: `/quincenas-ope/*`. La UAD y la nómina las decide `Quincenal`, que las
 * baja por `payload`, de modo que ambos reportes comparten la misma selección.
 */
export const CuentaReport: React.FC<CuentaReportProps> = ({ payload }) => {
    const [activeTab, setActiveTab] = useState<CuentaTab>('extras-simples')

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

    return (
        <Tabs activeTab={activeTab} onChange={id => setActiveTab(id as CuentaTab)}>
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
    )
}
