'use server'

import pool from '@/lib/postgres'
import { QueryResult, ComparisonResult } from '@/types'

export async function ejecutarQuery(query: string): Promise<QueryResult> {
  // console.log('Ejecutando query:', query)
  console.log(process.env.POSTGRES_URL)
  const client = await pool.connect()
  
  try {
    if (!query.trim()) {
      return {
        success: false,
        error: 'La query no puede estar vacía'
      }
    }

    const queryLowerCase = query.toLowerCase().trim()
    
    if (queryLowerCase.includes('drop') || 
        queryLowerCase.includes('delete') || 
        queryLowerCase.includes('truncate') || 
        queryLowerCase.includes('alter') ||
        queryLowerCase.includes('create') ||
        queryLowerCase.includes('insert') ||
        queryLowerCase.includes('update')) {
      return {
        success: false,
        error: 'Solo se permiten consultas SELECT por motivos de seguridad'
      }
    }

    const result = await client.query(query)
    
    return {
      success: true,
      data: result.rows,
      columns: result.fields.map(field => field.name),
      rowCount: result.rowCount || 0
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return {
      success: false,
      error: errorMessage
    }
  } finally {
    client.release()
  }
}

export async function compararResultados(userQuery: string, correctQuery: string): Promise<ComparisonResult> {
  try {
    const [userResult, expectedResult] = await Promise.all([
      ejecutarQuery(userQuery),
      ejecutarQuery(correctQuery)
    ])

    if (!userResult.success) {
      return {
        isCorrect: false,
        userResult,
        expectedResult,
        message: `Error en tu consulta: ${userResult.error}`
      }
    }

    if (!expectedResult.success) {
      return {
        isCorrect: false,
        userResult,
        expectedResult,
        message: 'Error en la consulta de referencia'
      }
    }

    const userData = userResult.data || []
    const expectedData = expectedResult.data || []

    if (userData.length !== expectedData.length) {
      return {
        isCorrect: false,
        userResult,
        expectedResult,
        message: `El número de filas no coincide. Tu consulta devolvió ${userData.length} filas, se esperaban ${expectedData.length}`
      }
    }

    const userColumns = (userResult.columns || []).sort()
    const expectedColumns = (expectedResult.columns || []).sort()

    if (JSON.stringify(userColumns) !== JSON.stringify(expectedColumns)) {
      return {
        isCorrect: false,
        userResult,
        expectedResult,
        message: 'Las columnas no coinciden con las esperadas'
      }
    }

    const userSorted = userData.map(row => 
      Object.keys(row).sort().reduce((acc, key) => {
        acc[key] = row[key]
        return acc
      }, {} as any)
    ).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))

    const expectedSorted = expectedData.map(row => 
      Object.keys(row).sort().reduce((acc, key) => {
        acc[key] = row[key]
        return acc
      }, {} as any)
    ).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))

    const resultsMatch = JSON.stringify(userSorted) === JSON.stringify(expectedSorted)

    return {
      isCorrect: resultsMatch,
      userResult,
      expectedResult,
      message: resultsMatch 
        ? '¡Correcto! Tu consulta produce el resultado esperado.' 
        : 'Los datos devueltos no coinciden con el resultado esperado.'
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return {
      isCorrect: false,
      userResult: { success: false, error: errorMessage },
      expectedResult: { success: false, error: errorMessage },
      message: `Error al comparar resultados: ${errorMessage}`
    }
  }
}