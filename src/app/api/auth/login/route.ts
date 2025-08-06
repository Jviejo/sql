import { NextRequest, NextResponse } from 'next/server'
import { sendVerificationCode } from '@/lib/email'

// Store verification codes in memory (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; expiresAt: Date }>()

// Generate a random 6-digit code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Generate verification code
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store code
    verificationCodes.set(email, { code, expiresAt })

    // Send email
    const emailResult = await sendVerificationCode(email, code)
    
    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, message: 'Error al enviar el email de verificación' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Código de verificación enviado a tu email' }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 