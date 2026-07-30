'use client'

import React from 'react'
import { InconsistenciasFilter } from './inconsistencias/components/InconsistenciasFilter'
import { InconsistenciasTable } from './inconsistencias/components/InconsistenciasTable'
import {
    InconsistenciasProvider,
    useInconsistenciasContext,
} from './inconsistencias/context/useInconsistenciasContext'

const InconsistenciasContent: React.FC = () => {
    const { modifiedRows, saving, handleSaveAll } = useInconsistenciasContext()

    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-full mx-auto'>
                <h1 className='text-4xl font-bold mb-2 text-gray-900'>Inconsistencias</h1>
                <p className='text-gray-600 mb-8'>
                    Gestiona y resuelve las inconsistencias de asistencia
                </p>

                {/* Filters Section */}
                <InconsistenciasFilter />

                {/* Table Section */}
                <InconsistenciasTable />

                {/* Save Button */}
                <div className='flex justify-end items-center gap-3 mt-6'>
                    {modifiedRows.length > 0 && (
                        <span className='text-sm text-gray-600 font-medium'>
                            {modifiedRows.length}{' '}
                            {modifiedRows.length === 1 ? 'cambio pendiente' : 'cambios pendientes'}
                        </span>
                    )}
                    <button
                        onClick={handleSaveAll}
                        disabled={saving || modifiedRows.length === 0}
                        className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-sm'
                    >
                        {saving && (
                            <div className='inline-block animate-spin'>
                                <div className='h-4 w-4 border-2 border-white border-t-transparent rounded-full'></div>
                            </div>
                        )}
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}

const Inconsistencias: React.FC = () => {
    return (
        <InconsistenciasProvider>
            <InconsistenciasContent />
        </InconsistenciasProvider>
    )
}

export default Inconsistencias
