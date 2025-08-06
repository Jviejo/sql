'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, AuthContextType } from '@/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [codigo, setCodigo] = useState<string>('')

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Verify token and set user
      verifyToken(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        localStorage.removeItem('auth_token')
      }
    } catch (error) {
      localStorage.removeItem('auth_token')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string) => {
    // Esta función se usa solo en producción
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      console.log(data, "se va a enviar el email 9")
      setCodigo(data.codigo)
     
      if (!data.success) {
        throw new Error(data.message)
      }
    } catch (error) {
      throw error
    }
  }

  const verifyCode = async (email: string, code: string) => {
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, codigo }),
      })

      const data = await response.json()
      
      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem('auth_token', data.token)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('auth_token')
  }

  const value: AuthContextType = {
    user,
    login,
    verifyCode,
    logout,
    isLoading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 