import { NextRequest, NextResponse } from 'next/server'
import { updateUserRole, deleteUser } from '@/actions/auth'
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authCheck = await checkAdminAuth(request)
    
    if (!authCheck.isAdmin) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: 403 }
      )
    }

    const { role } = await request.json()

    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Rol válido es requerido (user o admin)' },
        { status: 400 }
      )
    }

    const result = await updateUserRole(id, role)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Update user API error:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authCheck = await checkAdminAuth(request)
    
    if (!authCheck.isAdmin) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: 403 }
      )
    }

    const result = await deleteUser(id)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Delete user API error:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 