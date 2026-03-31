import React, { FC } from 'react'
import { Dayjs } from 'dayjs'
import { User, AttendanceType } from '@/interfaces/takeAttendance.interface'
import { Loading } from './Loading'

interface AttendanceTableProps {
    users: User[]
    attendancesByUser: {
        agent_roster: number
        name: string
        fechas: { fecha: string; attendance_type: string | null; weekend: boolean }[]
    }[]
    attendanceStatuses: AttendanceType[]
    dates: Dayjs[]
    loadingUsers: boolean
    saving: boolean
    handleAttendanceChange: (agent_roster: number, date: string, value: string) => void
    handleSaveAll: () => void
}

export const AttendanceTable: FC<AttendanceTableProps> = ({
    users,
    attendancesByUser,
    attendanceStatuses,
    dates,
    loadingUsers,
    saving,
    handleAttendanceChange,
    handleSaveAll,
}) => {
    if (users.length === 0) return null

    return (
        <>
            {loadingUsers && <Loading />}
            <div
                className={
                    loadingUsers
                        ? 'hidden transition-all duration-300'
                        : 'block transition-all duration-300'
                }
            >
                <div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='bg-gray-100 border-b-2 border-gray-300'>
                                    <th className='px-2 py-2 text-left font-bold text-gray-900 min-w-40 sticky left-0 bg-gray-100 z-10'>
                                        Usuario
                                    </th>
                                    {dates.map(date => (
                                        <th
                                            key={date.format('YYYY-MM-DD')}
                                            className='px-2 py-2 text-center font-bold text-gray-900 border-l border-gray-300 min-w-15'
                                        >
                                            <div className='text-xs font-bold uppercase tracking-wide'>
                                                {date.format('ddd')}
                                            </div>
                                            <div className='text-sm font-bold'>
                                                {date.format('DD')}
                                            </div>
                                            <div className='text-xs text-gray-600'>
                                                {date.format('MMM')}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {attendancesByUser.map(user => (
                                    <tr
                                        key={user.agent_roster}
                                        className='border-b border-gray-200 hover:bg-blue-50 transition-colors'
                                    >
                                        <td className='px-2 py-3 font-semibold text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-300'>
                                            {user.name}
                                        </td>
                                        {dates.map(date => {
                                            const dateStr = date.format('YYYY-MM-DD')
                                            const attendanceRecord = user.fechas.find(
                                                f => f.fecha.substring(0, 10) == dateStr,
                                            )
                                            return (
                                                <td
                                                    key={`${user.agent_roster}-${dateStr}`}
                                                    className='px-1 py-3 text-center border-l border-gray-300'
                                                >
                                                    <select
                                                        disabled={!attendanceRecord}
                                                        title={
                                                            attendanceRecord?.attendance_type
                                                                ? attendanceRecord?.attendance_type
                                                                : attendanceRecord?.weekend
                                                                  ? 'ddd'
                                                                  : 'x'
                                                        }
                                                        value={
                                                            attendanceRecord?.attendance_type
                                                                ? attendanceRecord?.attendance_type
                                                                : attendanceRecord?.weekend
                                                                  ? 'ddd'
                                                                  : 'x'
                                                        }
                                                        onChange={e =>
                                                            handleAttendanceChange(
                                                                user.agent_roster,
                                                                dateStr,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className='w-full px-1 py-1 rounded font-medium text-xs transition-all bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                                                    >
                                                        <option value=''>-</option>
                                                        {attendanceStatuses.map(status => (
                                                            <option
                                                                key={status.attendance_name}
                                                                value={status.short_name}
                                                            >
                                                                {status.display.toUpperCase()}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='flex justify-end gap-3 mt-6'>
                    <button
                        onClick={handleSaveAll}
                        disabled={saving}
                        className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2'
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
        </>
    )
}
