import { useLocale } from 'next-intl'

export const useFormatDate = () => {
    const locale = useLocale()

    const formatDate = (value: any): string => {
        if (typeof value === 'string') {
            // Verificar si la cadena es en formato ISO (YYYY-MM-DDTHH:mm:ss.000Z)
            if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
                // Extraer la fecha y la hora de la cadena ISO
                const [datePart, timePart] = value.split('T')
                const [year, month, day] = datePart.split('-')
                const [time] = timePart.split('.') // Eliminar los milisegundos si existen
                const [hours, minutes, seconds] = time.split(':')

                // Verificar si la hora es 00:00:00
                // if (hours === '00' && minutes === '00' && seconds === '00') {
                if (hours === '99' && minutes === '99' && seconds === '99') {
                    // if (hours === '00' && minutes === '00') {
                    // Formatear solo la fecha según el idioma
                    if (locale === 'en') {
                        return `${year}/${month}/${day}`
                    } else {
                        return `${day}/${month}/${year}`
                    }
                } else {
                    // Formatear la fecha y la hora según el idioma
                    if (locale === 'en') {
                        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
                    } else {
                        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                    }
                }
            }

            if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value)) {
                const [datePart, timePart] = value.split(' ')
                const [year, month, day] = datePart.split('-')
                const [hours, minutes] = timePart.split(':')

                if (locale === 'en') {
                    return `${year}/${month}/${day} ${hours}:${minutes}`
                } else {
                    return `${day}/${month}/${year} ${hours}:${minutes}`
                }
            }

            // Verificar si la cadena es solo una fecha (YYYY-MM-DD)
            if (/\d{4}-\d{2}-\d{2}/.test(value)) {
                const [year, month, day] = value.split('-')

                // Formatear solo la fecha según el idioma
                if (locale === 'en') {
                    return `${year}/${month}/${day}`
                } else {
                    return `${day}/${month}/${year}`
                }
            }
        }

        // Si no es una cadena de fecha válida, devolver el valor original
        return value
    }

    return { formatDate }
}
