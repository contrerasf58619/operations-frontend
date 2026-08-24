// Types
export interface InconsistenciaRow {
    id: number
    legajo: string
    documento: string
    nombreCompleto: string
    fecha: string
    ingreso: string
    salida: string
    tiempoDiferencia: number
    inconsistencia: string
    descripcion: string
    intervaloDesde: string
    intervaloHasta: string
    legajoJefeInmediato: number
    puestoEmpleado: string
    codigoPuesto: string
    tipoDesconexion: string
    motivo: string
    codAutorizanteNivel1: string
    codAutorizanteNivel2: string
}
