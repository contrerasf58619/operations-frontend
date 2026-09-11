/* ── 2FA / TOTP Interfaces ── */

// ─── Application ───
export interface TwoFactorApp {
    id: number
    name: string
    isActive: number // 1 = active, 0 = inactive
}

// ─── Generate (Flow A) ───
export interface GenerateSecretPayload {
    userId: number
    appId: number
}

export interface GenerateSecretResponse {
    secretId: number
    secret: string
    otpauthUrl: string
}

// ─── Register (Flow B — external import) ───
export interface RegisterSecretPayload {
    userId: number
    appId: number
    secret: string
    email: string
}

export interface RegisterSecretResponse {
    secretId: number
}

// ─── Codes ───
export interface TotpCodeItem {
    secretId: number
    appId: number
    appName: string
    email: string
    code: string
    remainingTime: number // seconds until current code expires (max 30)
}

// ─── Verify ───
export interface VerifyCodePayload {
    secretId: number
    token: string
}

export interface VerifyCodeResponse {
    valid: boolean
}

// ─── App management ───
export interface CreateAppPayload {
    name: string
}

export interface UpdateAppPayload {
    name?: string
}
