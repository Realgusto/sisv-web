"use server"

import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server"
import { TOKEN_KEY } from "./constants"

export default function middleware(request: NextRequest) {
    const auth = request.headers.get('Authorization')
    const token = request.cookies.get(TOKEN_KEY)
    const path = request.nextUrl.pathname

    if (path === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    } 
    
    if (path !== '/login' && !path.includes('/api') && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if ((path.startsWith('/api')) && (!auth || auth !== process.env.API_SECRET_KEY)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
}

export const config: MiddlewareConfig = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}