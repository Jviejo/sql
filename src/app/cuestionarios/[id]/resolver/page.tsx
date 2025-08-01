'use client'

import { useState, useEffect, use } from 'react'
import { obtenerCuestionario } from '@/actions/cuestionarios'
import { obtenerPreguntas } from '@/actions/preguntas'
import { compararResultados } from '@/actions/sql'
import { ComparisonResult, CuestionarioResponse, PreguntaResponse } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default function ResolverCuestionarioPage({ params }: Props) {
  const { id } = use(params)
  const [cuestionario, setCuestionario] = useState<CuestionarioResponse | null>(null)
  const [preguntas, setPreguntas] = useState<PreguntaResponse[]>([])
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [respuestaUsuario, setRespuestaUsuario] = useState('')
  const [resultado, setResultado] = useState<ComparisonResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [evaluando, setEvaluando] = useState(false)

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [cuestionarioData, preguntasData] = await Promise.all([
          obtenerCuestionario(id),
          obtenerPreguntas(id)
        ])
        setCuestionario(cuestionarioData)
        setPreguntas(preguntasData)
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!respuestaUsuario.trim()) return

    setEvaluando(true)
    try {
      const pregunta = preguntas[preguntaActual]
      const result = await compararResultados(respuestaUsuario, pregunta.respuestaCorrecta)
      setResultado(result)
    } catch (error) {
      console.error('Error evaluando respuesta:', error)
    } finally {
      setEvaluando(false)
    }
  }

  const siguientePregunta = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1)
      setRespuestaUsuario('')
      setResultado(null)
    }
  }

  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1)
      setRespuestaUsuario('')
      setResultado(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  if (!cuestionario || preguntas.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">
          No se encontró el cuestionario o no tiene preguntas.
        </div>
      </div>
    )
  }

  const pregunta = preguntas[preguntaActual]

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{cuestionario.titulo}</h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Pregunta {preguntaActual + 1} de {preguntas.length}
          </p>
          <a
            href="/cuestionarios"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ← Volver
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{pregunta.pregunta}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="query" className="block text-sm font-medium mb-2">
                Tu consulta SQL:
              </label>
              <textarea
                id="query"
                value={respuestaUsuario}
                onChange={(e) => setRespuestaUsuario(e.target.value)}
                className="w-full border rounded px-3 py-2 font-mono text-sm h-32"
                placeholder="Escribe tu consulta SQL aquí..."
                disabled={evaluando}
              />
            </div>
            
            <button
              type="submit"
              disabled={!respuestaUsuario.trim() || evaluando}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {evaluando ? 'Evaluando...' : 'Ejecutar Query'}
            </button>
          </form>
        </div>

        {resultado && (
          <div className={`border rounded-lg p-6 mb-6 ${
            resultado.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-4">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                resultado.isCorrect ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <h3 className="text-lg font-semibold">
                {resultado.isCorrect ? '¡Correcto!' : 'Incorrecto'}
              </h3>
            </div>
            
            <p className="mb-4">{resultado.message}</p>

            {resultado.userResult.success && resultado.userResult.data && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Tu resultado:</h4>
                <div className="bg-white border rounded p-3 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {resultado.userResult.columns?.map((col, i) => (
                          <th key={i} className="text-left p-2 font-medium">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {resultado.userResult.data.slice(0, 10).map((row, i) => (
                        <tr key={i} className="border-b">
                          {resultado.userResult.columns?.map((col, j) => (
                            <td key={j} className="p-2">{String(row[col] ?? '')}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {resultado.userResult.data.length > 10 && (
                    <p className="text-gray-500 text-sm mt-2">
                      ... y {resultado.userResult.data.length - 10} filas más
                    </p>
                  )}
                </div>
              </div>
            )}

            {!resultado.isCorrect && pregunta.explicacion && (
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h4 className="font-medium mb-2">Explicación:</h4>
                <p className="text-sm">{pregunta.explicacion}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={preguntaAnterior}
            disabled={preguntaActual === 0}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>
          
          <button
            onClick={siguientePregunta}
            disabled={preguntaActual === preguntas.length - 1}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  )
}