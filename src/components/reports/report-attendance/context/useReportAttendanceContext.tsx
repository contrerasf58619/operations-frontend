import { createContext, useContext } from 'react'
import { useReportAttendance } from '../hooks/useReportAttendance'

type ReportAttendanceContextType = ReturnType<typeof useReportAttendance>

const ReportAttendanceContext = createContext<ReportAttendanceContextType | null>(null)

export const ReportAttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useReportAttendance()
    return (
        <ReportAttendanceContext.Provider value={value}>
            {children}
        </ReportAttendanceContext.Provider>
    )
}

export const useReportAttendanceContext = () => {
    const context = useContext(ReportAttendanceContext)
    if (!context) {
        throw new Error('useReportAttendanceContext must be used within a ReportAttendanceProvider')
    }
    return context
}
