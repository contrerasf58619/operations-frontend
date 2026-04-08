import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export const useGetEmployeeCode = () => {
    const [employeeCode, setEmployeeCode] = useState<string | undefined>(undefined)

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        let attempts = 0
        const MAX_ATTEMPTS = 60 // máximo 30 segundos (60 * 500ms)

        const checkCookie = () => {
            try {
                const employeeCodeCookie = Cookies.get('employeeCode')

                if (employeeCodeCookie) {
                    setEmployeeCode(employeeCodeCookie)
                    if (interval) clearInterval(interval)
                    return
                }

                attempts++
                if (attempts >= MAX_ATTEMPTS) {
                    if (interval) clearInterval(interval)
                }
            } catch (error) {
                console.error('Error reading cookie:', error)
                if (interval) clearInterval(interval)
            }
        }

        checkCookie()
        interval = setInterval(checkCookie, 500)

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [])

    return { setEmployeeCode, employeeCode }
}
