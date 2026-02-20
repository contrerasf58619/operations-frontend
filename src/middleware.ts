import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken' // Make sure to install this library if you don't have it

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token')?.value

    // Detect if the request is a health check in AWS
    const userAgent = req.headers.get('user-agent') || ''
    const isHealthCheck =
        userAgent.includes('ELB-HealthChecker') ||
        userAgent.includes('Amazon-Route53-Health-Check-Service')

    // If it's a health check, allow the request to proceed
    if (isHealthCheck) {
        return NextResponse.next()
    }

    const loginPagePath = '/login'
    const homePagePath = '/'

    if (token) {
        try {
            // Decode the token to check if it has expired
            const decodedToken = jwt.decode(token) as { exp: number } | null

            // If the token has expired, redirect to the login page
            if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
                const response = NextResponse.redirect(new URL(loginPagePath, req.url))
                // Optional: Delete the expired token cookie
                response.cookies.delete('access_token')
                return response
            }

            // If the token is valid and not expired
            if (req.nextUrl.pathname === loginPagePath) {
                return NextResponse.redirect(new URL(homePagePath, req.url))
            }
            return NextResponse.next()
        } catch (error) {
            console.log(error)
            // If there's an error decoding the token, redirect to the login page
            const response = NextResponse.redirect(new URL(loginPagePath, req.url))
            response.cookies.delete('access_token')
            return response
        }
    } else {
        // If there's no token, check if the requested route is protected
        const protectedRoutes = config.matcher.filter(path => path !== loginPagePath)
        if (protectedRoutes.includes(req.nextUrl.pathname)) {
            return NextResponse.redirect(new URL(loginPagePath, req.url))
        }
        return NextResponse.next()
    }
}

export const config = {
    matcher: ['/', '/login'], // Add all protected routes here
}
