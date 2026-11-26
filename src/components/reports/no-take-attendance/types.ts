export interface NoTakeAttendanceRow {
    sup_code: number
    name: string
    total_agentes: number
    agentes_sin_asistencia: number
    dias_sin_asistencia: number
}

export interface AgentNoAttendanceRow {
    sup_code: number
    lider: string
    agent_code: number | string
    agente: string
    fecha_sin_asistencia: string
}
