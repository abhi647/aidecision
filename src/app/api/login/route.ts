import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    // Check against the environment variable password
    // Fallback if env variable is missing
    const validPassword = process.env.APP_PASSWORD || "TargetFoodsSecure2026!"

    if (password === validPassword) {
      // Create response and set HttpOnly cookie
      const response = NextResponse.json({ success: true })
      
      response.cookies.set({
        name: 'auth_token',
        value: 'authenticated',
        httpOnly: true,
        // Enforce secure cookies in production environments
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // Valid for 1 week
      })
      
      return response
    }

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Bad request' },
      { status: 400 }
    )
  }
}
