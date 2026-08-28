import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token')?.value
    const { pathname } = req.nextUrl

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
                const response =
                    pathname !== loginPagePath
                        ? NextResponse.redirect(new URL(loginPagePath, req.url))
                        : NextResponse.next()
                response.cookies.delete('access_token')
                return response
            }

            // If the token is valid and not expired
            if (pathname === loginPagePath) {
                return NextResponse.redirect(new URL(homePagePath, req.url))
            }
            return NextResponse.next()
        } catch (error) {
            console.log(error)
            // If there's an error decoding the token, redirect to the login page
            const response =
                pathname !== loginPagePath
                    ? NextResponse.redirect(new URL(loginPagePath, req.url))
                    : NextResponse.next()
            response.cookies.delete('access_token')
            return response
        }
    } else {
        // If there's no token, redirect to login page for all routes except login
        if (pathname !== loginPagePath) {
            return NextResponse.redirect(new URL(loginPagePath, req.url))
        }
        return NextResponse.next()
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
