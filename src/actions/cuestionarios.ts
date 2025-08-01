'use server'

import { ObjectId } from 'mongodb'
import { revalidatePath } from 'next/cache'
import clientPromise from '@/lib/mongodb'
import { Cuestionario, CuestionarioSchema } from '@/types'

export async function crearCuestionario(formData: FormData) {
  try {
    const data = {
      titulo: formData.get('titulo') as string,
      descripcion: formData.get('descripcion') as string,
      fechaCreacion: new Date(),
      activo: true,
    }

    const validatedData = CuestionarioSchema.parse(data)
    
    const client = await clientPromise
    const db = client.db('formacion')
    const collection = db.collection<Cuestionario>('cuestionarios')
    
    const result = await collection.insertOne(validatedData)
    
    revalidatePath('/cuestionarios')
    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error('Error creando cuestionario:', error)
    return { success: false, error: 'Error al crear el cuestionario' }
  }
}

export async function obtenerCuestionarios() {
  try {
    const client = await clientPromise
    const db = client.db('formacion')
    const collection = db.collection<Cuestionario>('cuestionarios')
    
    const cuestionarios = await collection.find({ activo: true }).sort({ fechaCreacion: -1 }).toArray()
    
    return cuestionarios.map(c => ({
      ...c,
      _id: c._id?.toString(),
    }))
  } catch (error) {
    console.error('Error obteniendo cuestionarios:', error)
    return []
  }
}

export async function obtenerCuestionario(id: string) {
  try {
    const client = await clientPromise
    const db = client.db('formacion')
    const collection = db.collection<Cuestionario>('cuestionarios')
    
    const cuestionario = await collection.findOne({ _id: new ObjectId(id) })
    
    if (!cuestionario) return null
    
    return {
      ...cuestionario,
      _id: cuestionario._id?.toString(),
    }
  } catch (error) {
    console.error('Error obteniendo cuestionario:', error)
    return null
  }
}

export async function actualizarCuestionario(id: string, formData: FormData) {
  try {
    const data = {
      titulo: formData.get('titulo') as string,
      descripcion: formData.get('descripcion') as string,
    }

    const validatedData = CuestionarioSchema.omit({ _id: true, fechaCreacion: true, activo: true }).parse(data)
    
    const client = await clientPromise
    const db = client.db('formacion')
    const collection = db.collection<Cuestionario>('cuestionarios')
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: validatedData }
    )
    
    revalidatePath('/cuestionarios')
    return { success: result.modifiedCount > 0 }
  } catch (error) {
    console.error('Error actualizando cuestionario:', error)
    return { success: false, error: 'Error al actualizar el cuestionario' }
  }
}

export async function eliminarCuestionario(id: string) {
  try {
    const client = await clientPromise
    const db = client.db('formacion')
    const collection = db.collection<Cuestionario>('cuestionarios')
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { activo: false } }
    )
    
    revalidatePath('/cuestionarios')
    return { success: result.modifiedCount > 0 }
  } catch (error) {
    console.error('Error eliminando cuestionario:', error)
    return { success: false, error: 'Error al eliminar el cuestionario' }
  }
}