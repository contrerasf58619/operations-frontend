export interface LoginPayload {
    username: string
    password: string
}

export interface ResetPasswordPayload {
    email: string
    username: string
}

export interface RegisterPayload {
    dpi: string
    code: string
    email: string
}

export interface ChangePasswordPayload {
    username: string
    oldPassword: string
    newPassword: string
    repeatPassword: string
}
