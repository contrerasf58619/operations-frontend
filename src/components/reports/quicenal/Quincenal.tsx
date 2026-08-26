'use client'

import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { UadList } from '@/components/catalogs/UadList'
import { PayrollBeforeDatesSelector } from '@/components/UI/PayrollBeforeDatesSelector'
import { CuentaReport } from './CuentaReport'
import { RosterReport } from './RosterReport'

/** Dimensión del reporte: por cuenta (cliente) o por roster (empleado). */
type GroupBy = 'cuenta' | 'roster'

const GROUP_BY_OPTIONS: { id: GroupBy; label: string }[] = [
    { id: 'cuenta', label: 'Por Cuenta' },
    { id: 'roster', label: 'Por Roster' },
]

/**
 * Shell del reporte quincenal.
 *
 * Aqui solo viven la seleccion de UAD/nomina y el switch de agrupacion; las
 * tablas las arman `CuentaReport` y `RosterReport`, que reciben el mismo
 * `payload`. Solo se monta el reporte activo, asi que los endpoints por roster
 * no se consultan hasta que alguien cambia el switch.
 */
const Quincenal: React.FC = () => {
    const [selectedUad, setSelectedUad] = useState<number>(0)
    const [selectedNomina, setSelectedNomina] = useState<number>(0)
    const [groupBy, setGroupBy] = useState<GroupBy>('cuenta')

    useEffect(() => {
        setSelectedNomina(0)
    }, [selectedUad])

    const payload =
        selectedUad && selectedNomina ? { uadId: selectedUad, idPayroll: selectedNomina } : null

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

                {showTable && (
                    <div className='mt-2'>
                        {/* Switch de agrupación */}
                        <div
                            role='group'
                            aria-label='Agrupación del reporte'
                            className='inline-flex rounded-lg border border-gray-200 bg-white p-1 mb-6'
                        >
                            {GROUP_BY_OPTIONS.map(({ id, label }) => {
                                const isActive = groupBy === id
                                return (
                                    <button
                                        key={id}
                                        type='button'
                                        aria-pressed={isActive}
                                        onClick={() => setGroupBy(id)}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>

                        {groupBy === 'cuenta' ? (
                            <CuentaReport payload={payload} />
                        ) : (
                            <RosterReport payload={payload} />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Quincenal
