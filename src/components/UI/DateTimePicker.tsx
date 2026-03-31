'use client'
import { FC } from 'react'

import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useTranslations, useLocale } from 'next-intl'
import { useDateContext } from '@/context/UI/DateContext'
import { CustomTitle } from './Custom/CustomTitle'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import localizedFormat from 'dayjs/plugin/localizedFormat'

// Importar los locales de date-fns
import { es } from 'date-fns/locale'
import { enUS } from 'date-fns/locale'

// Registrar los locales
registerLocale('es', es)
registerLocale('en', enUS)

dayjs.extend(utc)
dayjs.extend(localizedFormat)

export const CustomDatePicker: FC = () => {
    const { dateRange, setDateRange } = useDateContext()
    const [startDate, endDate] = dateRange
    const t = useTranslations()
    const locale = useLocale()

    const startDateObj = startDate ? dayjs(startDate).toDate() : null
    const endDateObj = endDate ? dayjs(endDate).toDate() : null

    const formatDate = (date: Date | null): string => {
        if (!date) return 'Fecha no seleccionada'

        return dayjs(date).format(locale === 'en' ? 'YYYY/MM/DD' : 'DD/MM/YYYY')
    }

    const handleChange = (dates: [Date | null, Date | null]) => {
        const formattedDates: [string, string] = [
            dates[0] ? dayjs.utc(dates[0]).local().format('YYYY-MM-DD') : '',
            dates[1] ? dayjs.utc(dates[1]).local().format('YYYY-MM-DD') : '',
        ]
        setDateRange(formattedDates)
    }

    const formattedStartDate = formatDate(startDateObj)
    const formattedEndDate = formatDate(endDateObj)

    return (
        <div className='my-4'>
            <CustomTitle text={t('general.dateRange')} />
            <div className='flex items-center gap-4'>
                <div className=''>
                    <DatePicker
                        selected={startDateObj}
                        onChange={handleChange}
                        startDate={startDateObj}
                        endDate={endDateObj}
                        selectsRange
                        className='outline-none px-2 py-[2px] rounded-lg border-[1px] mt-1 border-gray-200 focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500 pl-2 pr-6'
                        placeholderText={`${formattedStartDate} - ${formattedEndDate}`}
                        dateFormat={locale === 'en' ? 'yyyy/MM/dd' : 'dd/MM/yyyy'}
                        locale={locale === 'es' ? 'es' : 'en'}
                    />
                </div>
            </div>
        </div>
    )
}
