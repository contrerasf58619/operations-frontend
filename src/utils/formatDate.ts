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

// Opción 2: Con strings (más flexible)
export const calculateDifferenceHours = (fecha1: string | Date, fecha2: string | Date): number => {
    const f1 = fecha1 instanceof Date ? fecha1 : new Date(fecha1)
    const f2 = fecha2 instanceof Date ? fecha2 : new Date(fecha2)

    const diferenciaMs = Math.abs(f2.getTime() - f1.getTime())
    const horas = diferenciaMs / (1000 * 60 * 60)
    return horas
}
