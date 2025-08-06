'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthInfo from './AuthInfo'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  const { login, verifyCode } = useAuth()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      // Siempre enviar email (MailHog en desarrollo, Resend en producción)
      await login(email)
      setMessage('Código de verificación enviado a tu email')
      setStep('code')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al enviar el código')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Verificar código en el servidor
      await verifyCode(email, code)
      window.location.href = '/'
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al verificar el código')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setCode('')
    setError('')
    setMessage('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Welcome and motivational header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ¡Domina SQL! 🗄️
            </h1>
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
              Tu plataforma de formación en bases de datos
            </h2>
          </div>

          {/* Motivational benefits */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-6 shadow-sm">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Aprende SQL desde cero</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Práctica con bases de datos reales</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Cuestionarios interactivos</span>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {step === 'email' ? 'Comienza tu viaje SQL' : 'Casi listo para consultar'}
          </h3>
          <p className="text-sm text-gray-600">
            {step === 'email' 
              ? 'Ingresa tu email para recibir un código de verificación y acceder a ejercicios SQL exclusivos'
              : 'Ingresa el código que recibiste en tu email para completar tu registro y empezar a consultar'
            }
          </p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">🎉</span>
              <span>{message}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {step === 'email' ? (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm shadow-sm"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Enviando código...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>🗄️</span>
                    <span>¡Empezar con SQL!</span>
                  </div>
                )}
              </button>
            </div>

            {/* Additional encouragement */}
            <div className="text-center text-xs text-gray-500 mt-4">
              <p>✨ Únete a miles de desarrolladores que ya dominan SQL</p>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleCodeSubmit}>
            <div>
              <label htmlFor="code" className="sr-only">
                Código de verificación
              </label>
              <input
                id="code"
                name="code"
                type="text"
                autoComplete="one-time-code"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center tracking-widest shadow-sm"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isLoading}
                maxLength={6}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleBackToEmail}
                disabled={isLoading}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                ← Volver
              </button>
              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="flex-1 py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Verificando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>📊</span>
                    <span>¡Consultar datos!</span>
                  </div>
                )}
              </button>
            </div>

            {/* Final encouragement */}
            <div className="text-center text-xs text-gray-500 mt-4">
              <p>🎯 ¡Estás a un paso de dominar las consultas SQL!</p>
            </div>
          </form>
        )}

        {/* <AuthInfo /> */}
      </div>
    </div>
  )
} 