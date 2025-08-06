import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    
    // Test the connection
    await db.admin().ping()
    
    return NextResponse.json({
      success: true,
      message: 'Conexión a MongoDB exitosa',
      database: db.databaseName
    })
  } catch (error) {
    console.error('MongoDB connection error:', error)
    return NextResponse.json({
      success: false,
      message: 'Error de conexión a MongoDB',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
} 