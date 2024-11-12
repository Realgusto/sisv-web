"use server"

import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { TOKEN_KEY } from "./constants"

export async function middleware(request: NextRequest) {
    const cookie = await cookies()
    const token = cookie.get(TOKEN_KEY)

    const protectedRoutes = [ '/api', '/dashboard', '/movements' ]

    const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname)

    const isApiRoute = request.nextUrl.pathname.startsWith('/api')

    if (isProtectedRoute && !token && !isApiRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    } else if (request.nextUrl.pathname === '/login' && token && !isApiRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/api/:path*', '/dashboard/:path*', '/movements/:path*']
}