'use server'

import clientPromise from '@/lib/mongodb'
import jwt from 'jsonwebtoken'
import { User } from '@/types'
import { ObjectId } from 'mongodb'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Store verification codes in memory (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; expiresAt: Date }>()

export async function verifyCode(email: string, code: string, codigo: string) {
  try {
    console.log(`🔍 Verificando código para ${email}: ${code}`)

    // En producción, verificar el código almacenado
    if (codigo === code) {
      console.log(`👤 Usuario existente encontrado: ${email}`)
    } else {
      return { success: false, message: 'Código incorrecto' }
    }

    // Check if user exists in database
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    let user = await usersCollection.findOne({ email })

    if (!user) {
      console.log(`👤 Creando nuevo usuario: ${email}`)
      // Create new user
      const newUser = {
        email,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = await usersCollection.insertOne(newUser)
      user = {
        _id: result.insertedId,
        ...newUser
      }
    } else {
      console.log(`👤 Usuario existente encontrado: ${email}`)
    }

    const userData: User = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: userData.id, email: userData.email, role: userData.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log(`🎉 Autenticación exitosa para ${email}`)
    return { success: true, user: userData, token }
  } catch (error) {
    console.error('Verify code error:', error)
    return { success: false, message: 'Error interno del servidor' }
  }
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string }
    
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      return { success: false, message: 'Usuario no encontrado' }
    }

    const userData: User = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }

    return { success: true, user: userData }
  } catch (error) {
    return { success: false, message: 'Token inválido' }
  }
}

export async function createUser(email: string, role: 'user' | 'admin' = 'user') {
  try {
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    const newUser = {
      email,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await usersCollection.insertOne(newUser)
    
    const userData: User = {
      id: result.insertedId.toString(),
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    }

    return { success: true, user: userData }
  } catch (error) {
    console.error('Create user error:', error)
    return { success: false, message: 'Error al crear usuario' }
  }
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  try {
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          role, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after' }
    )

    if (!result || !result.value) {
      return { success: false, message: 'Usuario no encontrado' }
    }

    const userData: User = {
      id: result.value._id.toString(),
      email: result.value.email,
      role: result.value.role,
      createdAt: result.value.createdAt
    }

    return { success: true, user: userData }
  } catch (error) {
    console.error('Update user role error:', error)
    return { success: false, message: 'Error al actualizar usuario' }
  }
}

export async function deleteUser(userId: string) {
  try {
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) })

    if (result.deletedCount === 0) {
      return { success: false, message: 'Usuario no encontrado' }
    }

    return { success: true, message: 'Usuario eliminado correctamente' }
  } catch (error) {
    console.error('Delete user error:', error)
    return { success: false, message: 'Error al eliminar usuario' }
  }
}

export async function getAllUsers() {
  try {
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    const users = await usersCollection.find({}).sort({ createdAt: -1 }).toArray()

    const usersData: User[] = users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }))

    return { success: true, users: usersData }
  } catch (error) {
    console.error('Get all users error:', error)
    return { success: false, message: 'Error al obtener usuarios' }
  }
} 