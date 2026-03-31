import dayjs from 'dayjs'

export const formatDateWithHours = (date: string) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm')
}

export const formatDateWithHoursAndSeconds = (date: string) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm')
}

export const formatDate = (date: string) => {
    return dayjs(date).format('DD/MM/YYYY')
}

export const dateIsWeekend = (fechaStr: string | Date) => {
    const day = new Date(fechaStr).getUTCDay()
    return day === 0 || day === 6
}
