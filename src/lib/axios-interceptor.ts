import axios from 'axios'
import Cookies from 'js-cookie'
import { signOut } from 'aws-amplify/auth'

/**
 * Global axios response interceptor.
 * Redirects to /login when a 401 Unauthorized is detected,
 * either as an HTTP status code or inside the response body.
 */
async function redirectToLogin() {
    Cookies.remove('access_token')
    Cookies.remove('employeeCode')

    // Sign out from Cognito so the session is fully cleared
    try {
        await signOut()
    } catch {
        // Ignore sign-out errors — we're redirecting regardless
    }

    // Avoid redirect loops if already on the login page
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
    }
}

// Handle successful responses whose body contains status 401
axios.interceptors.response.use(
    response => {
        if (response.data?.status === 401) {
            redirectToLogin()
            return Promise.reject(new Error('Unauthorized'))
        }
        return response
    },
    error => {
        // Handle HTTP 401 status codes
        if (error.response?.status === 401) {
            redirectToLogin()
        }
        return Promise.reject(error)
    },
)
