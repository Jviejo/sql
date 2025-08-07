import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
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
    const token = request.cookies.get('auth_token')?.value  ||
                  request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Verificar que JWT_SECRET esté configurado
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado en las variables de entorno');
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
    } catch (error) {
      console.error('Error verificando JWT:', error);
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Validate JWT token for protected routes
  if (requiresAdmin) {
    const token = request.cookies.get('auth_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verificar que JWT_SECRET esté configurado
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado en las variables de entorno');
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
      // Aquí podrías verificar si el usuario tiene rol de admin
    } catch (error) {
      console.error('Error verificando JWT para admin:', error);
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