import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas que requieren autenticación
  const protectedRoutes = [
    '/cuestionarios',
    '/admin'
  ]

  // Rutas que requieren permisos de admin
  const adminRoutes = [
    '/admin'
  ]

  // Verificar si la ruta actual requiere autenticación
  const requiresAuth = protectedRoutes.some(route => pathname.startsWith(route))
  const requiresAdmin = adminRoutes.some(route => pathname.startsWith(route))

  if (requiresAuth) {
    // Para rutas protegidas, redirigir a login si no hay token
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/cuestionarios/:path*',
    '/admin/:path*',
  ],
} 