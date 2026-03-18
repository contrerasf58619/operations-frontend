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

export const dateIsWeekend = (fechaStr) => {
  const day = new Date(fechaStr).getUTCDay(); // 0 = domingo, 6 = sábado
  return day === 0 || day === 6;
};