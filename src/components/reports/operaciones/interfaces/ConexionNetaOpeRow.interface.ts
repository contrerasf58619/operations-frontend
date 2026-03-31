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
