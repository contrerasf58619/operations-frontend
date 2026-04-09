'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useGetEmployeeCode } from '@/hooks'
import { useEmployeeByCode } from '@/hooks/useRrhh'

interface EmployeeContextProps {
    employeeCode: string | undefined
    setEmployeeCode: React.Dispatch<React.SetStateAction<string | undefined>>
    employee: any
    loading: boolean
    error: any
}

const EmployeeContext = createContext<EmployeeContextProps | undefined>(undefined)

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
    const { employeeCode, setEmployeeCode } = useGetEmployeeCode()
    const { employee, loading, error } = useEmployeeByCode(employeeCode)

    return (
        <EmployeeContext.Provider
            value={{ employeeCode, setEmployeeCode, employee, loading, error }}
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
