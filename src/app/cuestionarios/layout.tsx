'use client'

import Link from 'next/link'
import UserHeader from '@/components/auth/UserHeader'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import SchemaPanel from './components/SchemaPanel'
import BatchUploadButton from './components/BatchUploadButton'

export default function CuestionariosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <div className="flex h-screen">
        {/* Panel izquierdo con esquema */}
        <div className="w-1/3 bg-gray-50 border-r overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Esquema de la Base de Datos</h2>
              {user.role === 'admin' && (
                <div className="flex gap-2">
                  <Link 
                    href="/cuestionarios/nuevo"
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Nuevo Cuestionario
                  </Link>
                  <BatchUploadButton />
                </div>
              )}
            </div>
            <SchemaPanel />
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Cuestionarios</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 