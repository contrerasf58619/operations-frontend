import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export const useGetEmployeeCode = () => {
    const [employeeCode, setEmployeeCode] = useState<string | undefined>(undefined)

    useEffect(() => {
        const interval = setInterval(() => {
            const employeeCodeCookie = Cookies.get('employeeCode')

            if (employeeCodeCookie) {
                setEmployeeCode(employeeCodeCookie)
                clearInterval(interval)
            }
        }, 500)

        return () => clearInterval(interval)
    }, [])

    return {
        setEmployeeCode,
        employeeCode,
    }
}
