'use client'

import React, { useState, useCallback } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { UadList } from '../catalogs/UadList'
import { useGetEmployeeCode } from '@/hooks'
import { Loading } from '../UI/Loading'
import { Autocomplete } from '../UI/Autocomplete'
import { PayrollPeriodSelector } from '../UI/PayrollPeriodSelector'
import { usePayrollPeriods } from '@/hooks/attendance/usePayrollPeriods'
import { useAttendanceTypes } from '@/hooks/attendance/useAttendanceTypes'
import { useLeaders } from '@/hooks/attendance/useLeaders'
import { useTeamAttendances } from '@/hooks/attendance/useTeamAttendances'
import { AttendanceTable } from '../UI/AttendanceTable'

const TakeAttendance: React.FC = () => {
    const [selectedUad, setSelectedUad] = useState<string>('') // administrative unit selected from UadList
    const [loadingPage, setLoadingPage] = useState(true)
    const { employeeCode } = useGetEmployeeCode()

    const {
        payrollPeriods,
        selectedPayrollPeriod,
        setSelectedPayrollPeriod,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        loadingPayroll,
    } = usePayrollPeriods(selectedUad, employeeCode)

    const { attendanceStatuses } = useAttendanceTypes(selectedUad)

    const { leaders, selectedLeader, setSelectedLeader, loadingLeaders } = useLeaders(
        selectedUad,
        startDate,
        endDate,
        employeeCode,
    )

    const {
        users,
        attendancesByUser,
        loadingUsers,
        setLoadingUsers,
        saving,
        handleAttendanceChange,
        handleSaveAll,
    } = useTeamAttendances(
        selectedLeader,
        selectedUad,
        startDate,
        endDate,
        setLoadingPage,
        employeeCode,
    )

    const getDatesInRange = useCallback((): Dayjs[] => {
        if (!startDate || !endDate) return []
        const dates: Dayjs[] = []
        let current = dayjs(startDate)
        const end = dayjs(endDate)

        while (current.isBefore(end) || current.isSame(end)) {
            dates.push(current)
            current = current.add(1, 'day')
        }
        return dates
    }, [startDate, endDate])

    const dates = getDatesInRange()

    return (
        <div className='p-6 bg-gray-50 min-h-screen'>
            <div className='max-w-7xl mx-auto'>
                <h1 className='text-4xl font-bold mb-2 text-gray-900'>
                    Fill your teams attendance
                </h1>
                <p className='text-gray-600 mb-8'>
                    Registra y administra la asistencia de tu equipo
                </p>

                {loadingPage && <Loading />}

                <div
                    className={
                        loadingPage
                            ? 'hidden transition-all duration-300'
                            : 'block transition-all duration-300'
                    }
                >
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                        <div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                            <label className='block text-sm font-semibold text-gray-900 mb-4'>
                                UAD
                            </label>
                            <div className='space-y-4'>
                                <UadList value={selectedUad} onChange={v => setSelectedUad(v)} />
                            </div>
                        </div>

                        <div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                            <label className='block text-sm font-semibold text-gray-900 mb-4'>
                                Periodo de nómina
                            </label>
                            <PayrollPeriodSelector
                                payrollPeriods={payrollPeriods}
                                selectedPayrollPeriod={selectedPayrollPeriod}
                                onChange={period => {
                                    setStartDate(period.date_from)
                                    setEndDate(period.date_to)
                                    setSelectedPayrollPeriod(period)
                                }}
                                loading={loadingPayroll}
                                disabled={!selectedUad}
                            />
                        </div>

                        <div className='bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
                            <label className='block text-sm font-semibold text-gray-900 mb-4'>
                                Seleccionar líder
                            </label>
                            <div className='space-y-2'>
                                <Autocomplete
                                    value={selectedLeader}
                                    onChange={val => {
                                        setSelectedLeader(val as string)
                                        setLoadingUsers(true)
                                    }}
                                    options={leaders.map(leader => ({
                                        value: leader.sup_code,
                                        label: leader.name,
                                    }))}
                                    placeholder='Buscar líder...'
                                    disabled={
                                        !selectedUad || loadingLeaders || leaders.length === 0
                                    }
                                    noOptionsText='No se encontraron líderes'
                                />
                                {loadingLeaders && (
                                    <div className='text-xs text-gray-500 mt-1'>
                                        Cargando líderes...
                                    </div>
                                )}
                                {!loadingLeaders && leaders.length === 0 && selectedUad && (
                                    <div className='text-xs text-gray-500 mt-1'>
                                        No se encontraron líderes
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {selectedLeader && (
                        <AttendanceTable
                            users={users}
                            attendancesByUser={attendancesByUser}
                            attendanceStatuses={attendanceStatuses}
                            dates={dates}
                            loadingUsers={loadingUsers}
                            saving={saving}
                            handleAttendanceChange={handleAttendanceChange}
                            handleSaveAll={handleSaveAll}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default TakeAttendance
