import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const token = request.cookies.get('token')?.value

    const isProtectedRoute = pathname.startsWith('/dashboard')
    const isPublicAuthRoute = pathname === '/login' || pathname === '/register'

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && isPublicAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/:path*'],
}
