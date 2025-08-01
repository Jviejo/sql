import { z } from 'zod'
import { ObjectId } from 'mongodb'

export const CuestionarioSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  titulo: z.string().min(1, 'El título es requerido'),
  descripcion: z.string().optional(),
  fechaCreacion: z.date().default(() => new Date()),
  activo: z.boolean().default(true),
})

export const PreguntaSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  cuestionarioId: z.instanceof(ObjectId),
  pregunta: z.string().min(1, 'La pregunta es requerida'),
  respuestaCorrecta: z.string().min(1, 'La respuesta correcta es requerida'),
  explicacion: z.string().optional(),
  orden: z.number().int().positive(),
  fechaCreacion: z.date().default(() => new Date()),
})

export type Cuestionario = z.infer<typeof CuestionarioSchema>
export type Pregunta = z.infer<typeof PreguntaSchema>

// Types for API responses where ObjectIds are converted to strings
export type CuestionarioResponse = Omit<Cuestionario, '_id'> & {
  _id: string
}

export type PreguntaResponse = Omit<Pregunta, '_id' | 'cuestionarioId'> & {
  _id: string
  cuestionarioId: string
}

export interface QueryResult {
  success: boolean
  data?: Record<string, unknown>[]
  error?: string
  columns?: string[]
  rowCount?: number
}

export interface ComparisonResult {
  isCorrect: boolean
  userResult: QueryResult
  expectedResult: QueryResult
  message: string
}