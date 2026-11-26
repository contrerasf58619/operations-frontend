'use client'

import React from 'react'
import { NoTakeAttendanceFilter } from './no-take-attendance/components/NoTakeAttendanceFilter'
import { NoTakeAttendanceTable } from './no-take-attendance/components/NoTakeAttendanceTable'
import { NoTakeAttendanceProvider } from './no-take-attendance/context/useNoTakeAttendanceContext'

const NoTakeAttendanceContent: React.FC = () => {
    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-full mx-auto'>
                <h1 className='text-4xl font-bold mb-2 text-gray-900'>
                    Reporte de no toma de asistencia
                </h1>
                <p className='text-gray-600 mb-8'>
                    Consulta y exporta los supervisores que no han tomado asistencia en el periodo
                    seleccionado
                </p>

                <NoTakeAttendanceFilter />

                <NoTakeAttendanceTable />
            </div>
        </div>
    )
}

const NoTakeAttendance: React.FC = () => {
    return (
        <NoTakeAttendanceProvider>
            <NoTakeAttendanceContent />
        </NoTakeAttendanceProvider>
    )
}

export default NoTakeAttendance
