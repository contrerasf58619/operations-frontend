export const getInitials = (fullName?: string) => {
    if (!fullName || fullName === 'Your name') return 'AG'
    const parts = fullName.trim().split(/\s+/)
    const first = parts[0]?.[0] || ''
    const last = parts[1]?.[0] || ''
    return (first + last).toUpperCase() || 'AG'
}
