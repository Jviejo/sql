import { NextRequest, NextResponse } from 'next/server'
import { verifyCode } from '@/actions/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code, codigo } = body

    console.log('🔍 API verify-code recibida:', { email, code, codigo })

    if (!email || !code) {
      console.log('❌ Datos faltantes:', { email: !!email, code: !!code })
      return NextResponse.json(
        { success: false, message: 'Email y código son requeridos' },
        { status: 400 }
      )
    }

    console.log('✅ Datos válidos, verificando código...')
    const result = await verifyCode(email, code, codigo)

    console.log('📋 Resultado de verificación:', result)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('❌ Error en verify-code API:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 