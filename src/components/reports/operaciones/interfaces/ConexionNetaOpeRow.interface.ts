/**
 * Matches the backend response fields.
 * Fields marked optional appear in the CSV display model but are not yet
 * returned by the current backend — they will just be undefined until added.
 *
 * CSV column → field mapping:
 *   ROSTER                → Codigo_Agente
 *   NOMBRE                → Nombre_Agente
 *   FECHA                 → Fecha
 *   NOMENCLATURA          → Asistencia_Planificacion
 *   HORARIO               → From_Time_Planning / To_Time_Planning
 *   PLANNED               → Planificacion_Diaria
 *   POSICION AGENTE       → Posicion_Agente  (optional)
 *   POSICION SUP          → Supervisor       (optional)
 *   WP_HOURS              → Hrs_WP
 *   LAW_HOURS             → Hrs_Ley
 *   CALCULATED_LAW_HOURS  → Calculated_Law_Hours (optional)
 *   LOGIN AMD             → Login
 *   LOGOUT AMD            → Logout
 *   LOGIN DMD             → Login_wp
 *   LOGOUT DMD            → Logout_wp
 *   STAFFED TIME HORAS    → Staffed_Time
 *   MISSING TIME HORAS    → Missing_Time
 *   WP_TOTAL              → WP_Total
 *   VTO                   → Vto
 *   TOTAL                 → Total            (optional)
 *   ASISTENCIA            → Asistencia
 *   PASE                  → WP
 *   FINAL                 → Final
 *   CONEXION_NETA         → Conexion_neta
 *   CONEXION_NETA_CALC    → Conexion_neta_calculada (optional)
 *   CONEXION_AMD          → Conexion_AMD     (optional)
 *   CONEXION_DMD          → Conexion_DMD     (optional)
 *   DIFERENCIA            → Diferencia       (optional)
 *   HORAS_EXTRA_SEG       → Horas_Extra      (optional)
 *   HORAS DDD             → Horas_DDD        (optional)
 *   HORAS_JORNADA_SEG     → Horas_Jornada    (optional)
 *   HORAS_DESCUENTO_SEG   → horas_descuento
 *   SEPTIMO_PROPORCIONAL  → septimo_proporcional
 *   (appended by backend) → Conexion_Neta_Semana
 *   (appended by backend) → Conexion_Neta_Proporcional
 */
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
