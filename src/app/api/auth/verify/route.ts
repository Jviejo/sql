import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/actions/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const result = await verifyToken(token)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 401 })
    }
  } catch (error) {
    console.error('Verify token API error:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 