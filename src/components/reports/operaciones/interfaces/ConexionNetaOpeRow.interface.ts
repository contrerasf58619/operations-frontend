/**
 * Matches the backend response fields.
 * Fields marked optional appear in the CSV display model but are not yet
 * returned by the current backend — they will just be undefined until added.
 *
 */

// This is the old interface that matches the backend response, it is used in the backend response parsing and then transformed into the Datum interface for the frontend display
export interface ConexionNetaOpeRow {
    // ── identity ──────────────────────────────────────────────────
    Codigo_Agente: number
    Nombre_Agente: string
    Fecha: string
    Asistencia_Planificacion: string
    From_Time_Planning: string | null
    To_Time_Planning: string | null
    Planificacion_Diaria: string
    Posicion_Agente?: string
    Supervisor?: string
    // ── hours ─────────────────────────────────────────────────────
    Hrs_WP: string
    Hrs_Ley: string
    Calculated_Law_Hours?: string
    // ── logins ────────────────────────────────────────────────────
    Login: string
    Logout: string
    Login_wp: string
    Logout_wp: string
    // ── time blocks ───────────────────────────────────────────────
    Staffed_Time: string
    Missing_Time: string
    WP_Total: string
    Vto: string
    Total?: string
    // ── attendance ────────────────────────────────────────────────
    Asistencia: string
    WP: string
    Final: string
    // ── conexion neta ─────────────────────────────────────────────
    Conexion_neta: string
    Conexion_neta_calculada?: string
    Conexion_AMD?: string
    Conexion_DMD?: string
    // ── payroll hours ─────────────────────────────────────────────
    Diferencia?: string
    Horas_Extra?: string
    Horas_DDD?: string
    Horas_Jornada?: string
    horas_descuento: string
    septimo_proporcional: string | null
    // ── weekly totals (always appended by backend) ────────────────
    Conexion_Neta_Semana: string
    Conexion_Neta_Proporcional: string
}

// this is the new interface from the data table that should be used in the frontend, it is based on the backend response but with more user friendly field names
export interface ConexionNetaOpeDatum {
    ROSTER: number
    NOMBRE: string
    FECHA: string
    NOMENCLATURA: Asistencia
    HORARIO: string
    PLANNED: string
    'POSICION AGENTE': string
    'POSICION SUP': string
    WP_HOURS: string
    LAW_HOURS: string
    CALCULATED_LAW_HOURS: string
    'LOGIN AMD': string
    'LOGOUT AMD': string
    'LOGIN DMD': string
    'LOGOUT DMD': string
    'STAFFED TIME HORAS': string
    'MISSING TIME HORAS': string
    WP_TOTAL: string
    VTO: string
    TOTAL: string
    ASISTENCIA: Asistencia
    PASE: string
    FINAL: Asistencia
    CONEXION_NETA: string
    CONEXION_NETA_CALCULADA: string
    CONEXION_AMD: string
    CONEXION_DMD: string
    DIFERENCIA: string
    HORAS_EXTRA_SEG: string
    'HORAS DDD': string
    HORAS_JORNADA_SEG: string
    HORAS_DESCUENTO_SEG: string
    SEPTIMO_PROPORCIONAL: string
}

export enum Asistencia {
    Baja = 'baja',
    Ddd = 'ddd',
    Fcj = 'fcj',
    Fcjsg = 'fcjsg',
    Fsj = 'fsj',
    ISR = 'isr',
    Icr = 'icr',
    Inc = 'inc',
    Inccj = 'inccj',
    Ios = 'ios',
    Late = 'late',
    Psg = 'psg',
    SUS = 'sus',
    Sig = 'sig',
    Vac = 'vac',
    X = 'x',
    Xos = 'xos',
}
