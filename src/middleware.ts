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

    // Public paths that don't require authentication
    const publicPaths = ['/login', '/forgot-password', '/register']
    const isPublicPath = publicPaths.some((path) => pathname === path)

    if (token) {
        try {
            // Decode the token to check if it has expired
            const decodedToken = jwt.decode(token) as { exp: number } | null

            // If the token has expired, redirect to the login page
            if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
                const response = !isPublicPath
                    ? NextResponse.redirect(new URL(loginPagePath, req.url))
                    : NextResponse.next()
                response.cookies.delete('access_token')
                return response
            }

            // If the token is valid and not expired, redirect away from public pages
            if (isPublicPath) {
                return NextResponse.redirect(new URL(homePagePath, req.url))
            }
            return NextResponse.next()
        } catch (error) {
            console.log(error, 'asss')
            // If there's an error decoding the token, redirect to the login page
            const response = !isPublicPath
                ? NextResponse.redirect(new URL(loginPagePath, req.url))
                : NextResponse.next()
            response.cookies.delete('access_token')
            return response
        }
    } else {
        // If there's no token, allow public paths and redirect everything else to login
        if (!isPublicPath) {
            return NextResponse.redirect(new URL(loginPagePath, req.url))
        }
        return NextResponse.next()
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
