export interface ConexionNetaOpeDataResponseAPIGT {
    status: number
    data: DatumGT[]
}

export interface SupervisorsResponse {
    status: number
    data: DatumSupervisorsResponse[]
}

export interface DatumSupervisorsResponse {
    sup_code: number
    full_name: string
    position_name: string
}

export interface DatumGT {
    ROSTER: number
    NOMBRE: string
    FECHA: string
    NOMENCLATURA: Asistencia
    HORARIO: string
    PLANNED: string
    'POSICION AGENTE': string
    'POSICION SUP': string
    SUP_NAME: string
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
    CONEXION_NETA_CALCULADA_WEEKLY: string
    CONEXION_AMD: string
    CONEXION_DMD: string
    DIFERENCIA: string
    HORAS_EXTRA_SEG: string
    'HORAS DDD': string
    HORAS_JORNADA_SEG: string
    HORAS_DESCUENTO_SEG: string
    SEPTIMO_PROPORCIONAL: string
    PORCENTAJE_CONEXION: string
}

export enum Asistencia {
    Asueto = 'asueto',
    AsuetoC = 'asuetoC',
    AsuetoF = 'asuetoF',
    Empty = '',
    Baja = 'baja',
    Ddd = 'ddd',
    Eps66 = 'eps66',
    Fcj = 'fcj',
    Fcjsg = 'fcjsg',
    Fcjl = 'fcjl',
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
    Vto = 'vto',
    X = 'x',
    Xos = 'xos',
}

export interface ConexionNetaOpeDataResponseAPIWorldWild {
    status: number
    data: DatumWild[]
}

export interface DatumWild {
    ROSTER: number
    NOMBRE: string
    FECHA: string
    NOMENCLATURA: Asistencia
    HORARIO: string
    PLANNED: string
    'POSICION AGENTE': string
    'POSICION SUP': string
    SUP_NAME: string
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
    CONEXION_NETA_CALCULADA_WEEKLY: string
    CONEXION_AMD: string
    CONEXION_DMD: string
    CONEXION_AM: string
    CONEXION_MIXTA: string
    CONEXION_PM: string
    DIFERENCIA: string
    HORAS_EXTRA_SEG: string
    HORAS_RECARGO: string
    HORAS_EXTRA_AM: string
    HORAS_EXTRA_MI: string
    HORAS_EXTRA_PM: string
    'HORAS DDD': string
    HORAS_DDD_AM: string
    HORAS_DDD_MI: string
    HORAS_DDD_PM: string
    HORAS_JORNADA_SEG: string
    HORAS_DESCUENTO_SEG: string
    SEPTIMO_PROPORCIONAL: string
    PORCENTAJE_CONEXION: string
}

export interface ConexionNetaOpeDataResponseAPICol {
    status: number
    data: DatumCOL[]
}

export interface DatumCOL {
    ROSTER: number
    NOMBRE: string
    FECHA: string
    NOMENCLATURA: Asistencia
    HORARIO: string
    PLANNED: string
    'POSICION AGENTE': string
    'POSICION SUP': string
    SUP_NAME: string
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
    CONEXION_NETA_CALCULADA_WEEKLY: string
    CONEXION_AMD: string
    CONEXION_DMD: string
    CONEXION_AM: string
    CONEXION_PM: string
    CONEXION_AM_CALCULADA: string
    CONEXION_PM_CALCULADA: string
    DIFERENCIA: string
    HORAS_EXTRA_SEG: string
    HORAS_EXTRA_DIURNO: string
    HORAS_EXTRA_NOCTURNO: string
    'HORAS DDD': string
    HORAS_DDD_DIURNO: string
    HORAS_DDD_NOCTURNO: string
    HORAS_JORNADA_SEG: string
    HORAS_ORDINARIAS_DIURNO: string
    HORAS_ORDINARIAS_NOCTURNO: string
    RECARGO_DIURNO: string
    RECARGO_NOCTURNO: string
    RECARGO_NOCTURNO_DOMINGO: string
    HORAS_DESCUENTO_SEG: string
    SEPTIMO_PROPORCIONAL: string
    PORCENTAJE_CONEXION: string
}
