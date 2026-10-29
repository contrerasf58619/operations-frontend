'use client'

import React from 'react'
import { ReportAttendanceFilter } from './report-attendance/components/ReportAttendanceFilter'
import { ReportAttendanceTable } from './report-attendance/components/ReportAttendanceTable'
import {
    ReportAttendanceProvider,
} from './report-attendance/context/useReportAttendanceContext'

const ReportAttendanceContent: React.FC = () => {
    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-full mx-auto'>
                <h1 className='text-4xl font-bold mb-2 text-gray-900'>Reporte de Asistencia</h1>
                <p className='text-gray-600 mb-8'>
                    Consulta y exporta el reporte de asistencia de tu equipo
                </p>

                {/* Filters Section */}
                <ReportAttendanceFilter />

                {/* Table Section */}
                <ReportAttendanceTable />
            </div>
        </div>
    )
}

const ReportAttendance: React.FC = () => {
    return (
        <ReportAttendanceProvider>
            <ReportAttendanceContent />
        </ReportAttendanceProvider>
    )
}

export default ReportAttendance