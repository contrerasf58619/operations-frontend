import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export const useGetEmployeeCode = () => {
    const [employeeCode, setEmployeeCode] = useState<number>()

    useEffect(() => {
        const interval = setInterval(() => {
            const employeeCodeCookie = Cookies.get('employeeCode')
            const employeeCode = employeeCodeCookie ? + employeeCodeCookie : 0
            if (employeeCodeCookie) {
                setEmployeeCode(employeeCode)
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
