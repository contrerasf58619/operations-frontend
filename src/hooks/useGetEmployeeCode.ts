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
        let intervalId: number | null = null
        let attempts = 0
        const MAX_ATTEMPTS = 60

        const syncEmployeeCode = () => {
            try {
                const nextEmployeeCode = readEmployeeCode()

                if (nextEmployeeCode === undefined) {
                    attempts += 1

                    if (attempts >= MAX_ATTEMPTS && intervalId !== null) {
                        window.clearInterval(intervalId)
                    }

                    return false
                }

                setEmployeeCode(nextEmployeeCode)
                return true
            } catch (error) {
                console.error('Error reading employeeCode cookie:', error)

                if (intervalId !== null) {
                    window.clearInterval(intervalId)
                }

                return true
            }
        }

        if (syncEmployeeCode()) {
            return
        }

        intervalId = window.setInterval(() => {
            if (syncEmployeeCode() && intervalId !== null) {
                window.clearInterval(intervalId)
            }
        }, 500)

        return () => {
            if (intervalId !== null) {
                window.clearInterval(intervalId)
            }
        }
    }, [])

    return { setEmployeeCode, employeeCode }
}
