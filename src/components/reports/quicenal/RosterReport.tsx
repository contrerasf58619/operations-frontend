'use client'

import React, { useState } from 'react'
import { Tabs, Tab } from '@/components/UI/Tabs'
import { OvertimePayload } from '@/api/alerts.api'
import { VariationPanel } from './shared'
import {
    columnsRosterExtrasDDD,
    columnsRosterExtrasSimples,
    columnsRosterExtrasWp,
    // columnsRosterRecargoNocturno,
    columnsRosterTotalExtrasSimples,
} from './columns'
import {
    useExtrasSimplesByRosterAlerts,
    useExtrasDDDByRosterAlerts,
    useExtrasWpByRosterAlerts,
    useTotalExtrasSimplesByRosterAlerts,
} from '@/hooks/useAlerts'

type RosterTab =
    | 'extras-simples'
    | 'ddd-asuetos'
    | 'extras-wp'
    | 'total-extras-simples'
    | 'extras-nocturno'

interface RosterReportProps {
    /** `null` mientras no haya UAD y nómina seleccionadas: los hooks no disparan. */
    payload: OvertimePayload | null
}

/**
 * Variación quincenal agrupada por ROSTER: una fila por empleado.
 *
 * Backend: `/quincenas-ope/roster/*`. Mismas medidas y mismo cálculo que
 * `CuentaReport`; lo único que cambia es la dimensión, así que cada tabla abre
 * con roster_id, nombre y cuenta antes de las columnas de periodos.
 *
 * En las UADs de Colombia (43 TPG, 46 Verizon) la columna `cuenta` no existe y
 * llega en null; las filas siguen siendo una por empleado.
 */
export const RosterReport: React.FC<RosterReportProps> = ({ payload }) => {
    const [activeTab, setActiveTab] = useState<RosterTab>('extras-simples')

    const {
        alerts: rosterDataExtrasSimples,
        loading: loadingRosterExtrasSimples,
        error: errorRosterExtrasSimples,
    } = useExtrasSimplesByRosterAlerts(payload)

    const {
        alerts: rosterDataExtrasDdd,
        loading: loadingRosterExtrasDdd,
        error: errorRosterExtrasDdd,
    } = useExtrasDDDByRosterAlerts(payload)

    const {
        alerts: rosterDataExtrasWp,
        loading: loadingRosterExtrasWp,
        error: errorRosterExtrasWp,
    } = useExtrasWpByRosterAlerts(payload)

    const {
        alerts: rosterDataTotalExtrasSimples,
        loading: loadingRosterTotalExtrasSimples,
        error: errorRosterTotalExtrasSimples,
    } = useTotalExtrasSimplesByRosterAlerts(payload)

    return (
        <Tabs activeTab={activeTab} onChange={id => setActiveTab(id as RosterTab)}>
            <Tab id='extras-simples' label='Extras simples'>
                <VariationPanel
                    loading={loadingRosterExtrasSimples}
                    error={errorRosterExtrasSimples}
                    data={rosterDataExtrasSimples}
                    columns={columnsRosterExtrasSimples}
                    searchPlaceholder='Buscar roster, nombre o cuenta...'
                />
            </Tab>

            <Tab id='ddd-asuetos' label='Extras DDD'>
                <VariationPanel
                    loading={loadingRosterExtrasDdd}
                    error={errorRosterExtrasDdd}
                    data={rosterDataExtrasDdd}
                    columns={columnsRosterExtrasDDD}
                    searchPlaceholder='Buscar roster, nombre o cuenta...'
                />
            </Tab>

            <Tab id='extras-wp' label='Extras WP'>
                <VariationPanel
                    loading={loadingRosterExtrasWp}
                    error={errorRosterExtrasWp}
                    data={rosterDataExtrasWp}
                    columns={columnsRosterExtrasWp}
                    searchPlaceholder='Buscar roster, nombre o cuenta...'
                />
            </Tab>

            <Tab id='total-extras-simples' label='Total Extras Simples'>
                <VariationPanel
                    loading={loadingRosterTotalExtrasSimples}
                    error={errorRosterTotalExtrasSimples}
                    data={rosterDataTotalExtrasSimples}
                    columns={columnsRosterTotalExtrasSimples}
                    searchPlaceholder='Buscar roster, nombre o cuenta...'
                />
            </Tab>

            {/* Pendiente: el endpoint de recargo nocturno aun no existe en el backend,
                ni por cuenta ni por roster. `columnsRosterRecargoNocturno` ya esta listo.
            <Tab id='extras-nocturno' label='Extras Nocturno'>
                <VariationPanel
                    loading={loadingRosterRecargoNocturno}
                    error={errorRosterRecargoNocturno}
                    data={rosterDataRecargoNocturno}
                    columns={columnsRosterRecargoNocturno}
                />
            </Tab> */}
        </Tabs>
    )
}
