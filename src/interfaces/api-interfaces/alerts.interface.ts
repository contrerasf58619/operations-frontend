export interface HoursonVacationAlertResponse {
    roster_id: number
    semana: string
    horas_asueto: string
    horas_productivas: string
    porcentaje: number
}

export interface HoursOnTheWorkdayAlertResponse {
    roster_id: number
    semana: string
    horas_jornada: string
    wp_hours: string
    porcentaje?: number
}
