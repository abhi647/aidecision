import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow access to the login page and the login API endpoint
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isLoginApi = request.nextUrl.pathname === '/api/login'

  if (isLoginPage || isLoginApi) {
    return NextResponse.next()
  }

  // Check for the authentication token cookie
  const token = request.cookies.get('auth_token')

  if (!token || token.value !== 'authenticated') {
    // If it's an API request, return 401 Unauthorized
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ error: 'authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }
    // Otherwise, redirect the user to the login page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - screenshots (local static analysis imagery)
     */
    '/((?!_next/static|_next/image|favicon.ico|screenshots).*)',
  ],
}
