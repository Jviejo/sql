'use server'

import { ObjectId } from 'mongodb'
import { revalidatePath } from 'next/cache'
import clientPromise from '@/lib/mongodb'
import { Pregunta, PreguntaSchema } from '@/types'

export async function crearPregunta(formData: FormData) {
  try {
    const data = {
      cuestionarioId: new ObjectId(formData.get('cuestionarioId') as string),
      pregunta: formData.get('pregunta') as string,
      respuestaCorrecta: formData.get('respuestaCorrecta') as string,
      explicacion: formData.get('explicacion') as string,
      orden: parseInt(formData.get('orden') as string),
      fechaCreacion: new Date(),
    }

    const validatedData = PreguntaSchema.parse(data)
    
    const client = await clientPromise
    const db = client.db('formacion')
    const collection = db.collection<Pregunta>('preguntas')
    
    const result = await collection.insertOne(validatedData)
    
    revalidatePath('/preguntas')
    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error('Error creando pregunta:', error)
    return { success: false, error: 'Error al crear la pregunta' }
  }
}

export async function obtenerPreguntas(cuestionarioId?: string) {
  try {
    const client = await clientPromise
    const db = client.db('formacion')
    const collection = db.collection<Pregunta>('preguntas')
    
    const filter = cuestionarioId ? { cuestionarioId: new ObjectId(cuestionarioId) } : {}
    const preguntas = await collection.find(filter).sort({ orden: 1 }).toArray()
    
    return preguntas.map(p => ({
      ...p,
      _id: p._id?.toString(),
      cuestionarioId: p.cuestionarioId.toString(),
    }))
  } catch (error) {
    console.error('Error obteniendo preguntas:', error)
    return []
  }
}

export async function obtenerPregunta(id: string) {
  try {
    const client = await clientPromise
    const db = client.db('formacion')
    const collection = db.collection<Pregunta>('preguntas')
    
    const pregunta = await collection.findOne({ _id: new ObjectId(id) })
    
    if (!pregunta) return null
    
    return {
      ...pregunta,
      _id: pregunta._id?.toString(),
      cuestionarioId: pregunta.cuestionarioId.toString(),
    }
  } catch (error) {
    console.error('Error obteniendo pregunta:', error)
    return null
  }
}

export async function actualizarPregunta(id: string, formData: FormData) {
  try {
    const data = {
      pregunta: formData.get('pregunta') as string,
      respuestaCorrecta: formData.get('respuestaCorrecta') as string,
      explicacion: formData.get('explicacion') as string,
      orden: parseInt(formData.get('orden') as string),
    }

    const validatedData = PreguntaSchema.omit({ 
      _id: true, 
      cuestionarioId: true, 
      fechaCreacion: true 
    }).parse(data)
    
    const client = await clientPromise
    const db = client.db('formacion')
    const collection = db.collection<Pregunta>('preguntas')
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: validatedData }
    )
    
    revalidatePath('/preguntas')
    return { success: result.modifiedCount > 0 }
  } catch (error) {
    console.error('Error actualizando pregunta:', error)
    return { success: false, error: 'Error al actualizar la pregunta' }
  }
}

export async function eliminarPregunta(id: string) {
  try {
    const client = await clientPromise
    const db = client.db('formacion')
    const collection = db.collection<Pregunta>('preguntas')
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    
    revalidatePath('/preguntas')
    return { success: result.deletedCount > 0 }
  } catch (error) {
    console.error('Error eliminando pregunta:', error)
    return { success: false, error: 'Error al eliminar la pregunta' }
  }
}