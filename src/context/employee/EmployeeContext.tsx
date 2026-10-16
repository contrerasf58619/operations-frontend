'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useGetEmployeeCode } from '@/hooks'
import { useMyData } from '@/hooks/useRrhh'

interface EmployeeContextProps {
    employeeCode: string | undefined
    setEmployeeCode: React.Dispatch<React.SetStateAction<string | undefined>>
    employee: any
    loading: boolean
    error: any
}

const EmployeeContext = createContext<EmployeeContextProps | undefined>(undefined)

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
    const { employee, loading, error } = useMyData()
    const { employeeCode, setEmployeeCode } = useGetEmployeeCode()

    return (
        <EmployeeContext.Provider
            value={{
                employeeCode,
                setEmployeeCode,
                employee,
                loading,
                error,
            }}
        >
            {children}
        </EmployeeContext.Provider>
    )
}

export const useEmployeeContext = () => {
    const context = useContext(EmployeeContext)
    if (context === undefined) {
        throw new Error('useEmployeeContext must be used within an EmployeeProvider')
    }
    return context
}
