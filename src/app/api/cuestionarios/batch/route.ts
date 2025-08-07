import { NextRequest, NextResponse } from 'next/server'
import { crearCuestionarioBatch } from '@/actions/cuestionarios'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar que el body tenga la estructura correcta
    if (!body.nombreCuestionario || !body.preguntas || !Array.isArray(body.preguntas)) {
      return NextResponse.json(
        { message: 'Formato inválido. Debe incluir nombreCuestionario y preguntas.' },
        { status: 400 }
      )
    }

    // Validar que cada pregunta tenga los campos requeridos
    for (const pregunta of body.preguntas) {
      if (!pregunta.pregunta || !pregunta.respuestaCorrecta || !pregunta.explicacion || !pregunta.orden) {
        return NextResponse.json(
          { message: 'Cada pregunta debe tener pregunta, respuestaCorrecta, explicacion y orden.' },
          { status: 400 }
        )
      }
    }

    const result = await crearCuestionarioBatch(body)
    
    if (!result.success) {
      return NextResponse.json(
        { message: result.error || 'Error al crear el cuestionario' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Cuestionario creado exitosamente',
      cuestionarioId: result.cuestionarioId,
      preguntasCreadas: result.preguntasCreadas
    })
  } catch (error) {
    console.error('Error en endpoint batch:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 