'use client'

import React, { createContext, FC, useContext, useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(utc)
dayjs.extend(localizedFormat)

interface ContextProps {
    dateRange: [string, string]
    handleReset: () => void
    setDateRange: (dates: [string, string]) => void
}

const DateContext = createContext<ContextProps>({} as ContextProps)

export const DateProvider: FC<React.PropsWithChildren> = ({ children }) => {
    const today = dayjs().utc().local()
    const lastWeek = today.subtract(7, 'day')

    const formatDate = (date: dayjs.Dayjs) => date.format('YYYY-MM-DD')

    const [dateRange, setDateRange] = useState<[string, string]>([
        formatDate(lastWeek),
        formatDate(today),
    ])

    const handleReset = () => {
        const today = dayjs().utc().local()
        const lastWeek = today.subtract(7, 'day')

        setDateRange([formatDate(lastWeek), formatDate(today)])
    }

    return (
        <DateContext.Provider value={{ dateRange, setDateRange, handleReset }}>
            {children}
        </DateContext.Provider>
    )
}

export const useDateContext = () => useContext(DateContext)
