'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'
import Link from 'next/link'

interface AdminGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso requerido
          </h2>
          <p className="text-gray-600 mb-4">
            Debes iniciar sesión para acceder a esta página.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Ir al login
          </Link>
        </div>
      </div>
    )
  }

  if (user.role !== 'admin') {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso denegado
          </h2>
          <p className="text-gray-600 mb-4">
            Se requieren permisos de administrador para acceder a esta página.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 