export interface AttendanceEntry {
    userId: string
    userName: string
    entries: Record<string, string>
}

export interface AttendanceUser {
    id: string
    name: string
    position?: string
    department?: string
}

export interface AttendanceLeader {
    id: string
    name: string
    email?: string
}

export interface AttendanceRecord {
    [key: string]: AttendanceEntry
}

export interface AttendanceStatus {
    code: string
    label: string
    color: string
    description?: string
}

export interface AttendancePayload {
    startDate: string
    endDate: string
    leaderId: string
    attendance: Record<string, Record<string, string>>
}

export interface AttendanceResponse {
    success: boolean
    message?: string
    data?: any
}
