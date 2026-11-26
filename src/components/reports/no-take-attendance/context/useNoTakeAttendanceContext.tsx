import { createContext, useContext } from 'react'
import { useNoTakeAttendance } from '../hooks/useNoTakeAttendance'

type NoTakeAttendanceContextType = ReturnType<typeof useNoTakeAttendance>

const NoTakeAttendanceContext = createContext<NoTakeAttendanceContextType | null>(null)

export const NoTakeAttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const value = useNoTakeAttendance()
    return (
        <NoTakeAttendanceContext.Provider value={value}>
            {children}
        </NoTakeAttendanceContext.Provider>
    )
}

export const useNoTakeAttendanceContext = () => {
    const context = useContext(NoTakeAttendanceContext)
    if (!context) {
        throw new Error('useNoTakeAttendanceContext must be used within a NoTakeAttendanceProvider')
    }
    return context
}
