'use client'

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import UserHeader from "@/components/auth/UserHeader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Sistema de Cuestionarios SQL</h1>
          <p className="text-xl text-gray-600 mb-8">
            Aprende y practica SQL con cuestionarios interactivos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Resolver Cuestionarios</h2>
            <p className="text-gray-600 mb-4">
              Practica tus habilidades SQL resolviendo cuestionarios interactivos. 
              Escribe tus consultas y recibe feedback inmediato.
            </p>
            <Link 
              href="/cuestionarios"
              className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 inline-block"
            >
              Ver Cuestionarios
            </Link>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Administrar</h2>
            <p className="text-gray-600 mb-4">
              Crea y gestiona cuestionarios y preguntas. Configura las consultas
              correctas y proporciona explicaciones para ayudar a los estudiantes.
            </p>
            <Link 
              href="/cuestionarios"
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 inline-block"
            >
              Gestionar
            </Link>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="mt-6 max-w-4xl mx-auto">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Administración</h2>
              <p className="text-gray-600 mb-4">
                Como administrador, puedes gestionar usuarios y configurar el sistema.
              </p>
              <Link 
                href="/admin/users"
                className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 inline-block"
              >
                Gestionar Usuarios
              </Link>
            </div>
          </div>
        )}

        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Características</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold mb-2">Ejecución en Tiempo Real</h3>
              <p className="text-gray-600 text-sm">
                Ejecuta tus consultas contra una base de datos PostgreSQL real
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-semibold mb-2">Validación Automática</h3>
              <p className="text-gray-600 text-sm">
                Compara automáticamente tus resultados con las respuestas correctas
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-semibold mb-2">Explicaciones</h3>
              <p className="text-gray-600 text-sm">
                Recibe explicaciones detalladas para mejorar tu comprensión
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
