'use client'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

function readEmployeeCode() {
    const employeeCodeCookie = Cookies.get('employeeCode')

    if (!employeeCodeCookie) {
        return undefined
    }

    const parsedEmployeeCode = Number(employeeCodeCookie)

    return Number.isNaN(parsedEmployeeCode) ? undefined : parsedEmployeeCode
}

export const useGetEmployeeCode = () => {
    const [employeeCode, setEmployeeCode] = useState<number>()

    useEffect(() => {
        const syncEmployeeCode = () => {
            const nextEmployeeCode = readEmployeeCode()

            if (nextEmployeeCode === undefined) {
                return false
            }

            setEmployeeCode(nextEmployeeCode)
            return true
        }

        if (syncEmployeeCode()) {
            return
        }

        const interval = window.setInterval(() => {
            if (syncEmployeeCode()) {
                window.clearInterval(interval)
            }
        }, 500)

        return () => window.clearInterval(interval)
    }, [])

    return {
        setEmployeeCode,
        employeeCode,
    }
}
