'use client'

import { useState, useEffect } from 'react'
import AdminGuard from '@/components/auth/AdminGuard'
import { User } from '@/types'

interface UserWithActions extends User {
  isEditing?: boolean
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithActions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin'>('user')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        setError('Error al cargar usuarios')
      }
    } catch (error) {
      setError('Error al cargar usuarios')
    } finally {
      setIsLoading(false)
    }
  }

  const createUser = async () => {
    if (!newUserEmail.trim()) return

    setIsCreating(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newUserEmail,
          role: newUserRole
        })
      })

      if (response.ok) {
        const data = await response.json()
        setUsers([data.user, ...users])
        setNewUserEmail('')
        setNewUserRole('user')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al crear usuario')
      }
    } catch (error) {
      setError('Error al crear usuario')
    } finally {
      setIsCreating(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(users.map(user => 
          user.id === userId ? data.user : user
        ))
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al actualizar usuario')
      }
    } catch (error) {
      setError('Error al actualizar usuario')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al eliminar usuario')
      }
    } catch (error) {
      setError('Error al eliminar usuario')
    }
  }

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
              <button
                onClick={() => setError('')}
                className="float-right text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Create new user form */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Crear nuevo usuario</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  id="role"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as 'user' | 'admin')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={createUser}
                  disabled={isCreating || !newUserEmail.trim()}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creando...' : 'Crear usuario'}
                </button>
              </div>
            </div>
          </div>

          {/* Users list */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {isLoading ? (
                <li className="px-6 py-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </li>
              ) : users.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500">
                  No hay usuarios registrados
                </li>
              ) : (
                users.map((user) => (
                  <li key={user.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            Creado el {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as 'user' | 'admin')}
                          className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="user">Usuario</option>
                          <option value="admin">Administrador</option>
                        </select>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
} 