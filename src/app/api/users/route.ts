import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, createUser } from '@/actions/auth'
import { verifyToken } from '@/actions/auth'

// Middleware to check if user is admin
async function checkAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isAdmin: false, message: 'Token de autorización requerido' }
  }

  const token = authHeader.substring(7)
  const result = await verifyToken(token)

  if (!result.success || result.user?.role !== 'admin') {
    return { isAdmin: false, message: 'Acceso denegado. Se requieren permisos de administrador.' }
  }

  return { isAdmin: true }
}

export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkAdminAuth(request)
    
    if (!authCheck.isAdmin) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: 403 }
      )
    }

    const result = await getAllUsers()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Get users API error:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCheck = await checkAdminAuth(request)
    
    if (!authCheck.isAdmin) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: 403 }
      )
    }

    const { email, role = 'user' } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email es requerido' },
        { status: 400 }
      )
    }

    const result = await createUser(email, role)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Create user API error:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 