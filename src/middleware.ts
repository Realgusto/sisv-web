"use server"

import { NextRequest, NextResponse } from "next/server"
import { TOKEN_KEY } from "./constants"

export default function middleware(request: NextRequest) {
    const token = request.cookies.get(TOKEN_KEY)
    const path = request.nextUrl.pathname

    if (path === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    } 
    
    // if (path.includes('/dashboard') && !token) {
    if (path !== '/login'  && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}