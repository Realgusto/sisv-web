"use server"

import { NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { TOKEN_KEY } from "./constants"

export async function middleware(request: NextRequest) {
    const cookie = await cookies()
    const token = cookie.get(TOKEN_KEY)

    const protectedRoutes = [ '/dashboard' ]

    const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname)

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*']
}