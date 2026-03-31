export interface AttendanceEntry {
    userId: string
    userName: string
    entries: Record<string, string>
}

export interface User {
    agent_roster: number
    name: string
}

export interface AttendanceRecord {
    [key: string]: AttendanceEntry
}

export interface Leader {
    sup_code: string
    name: string
}

export interface AttendanceType {
    attendance_name: string
    short_name: string
    display: string
}
