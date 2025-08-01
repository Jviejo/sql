import Link from 'next/link'
import { obtenerPreguntas } from '@/actions/preguntas'
import { obtenerCuestionario } from '@/actions/cuestionarios'
import { notFound } from 'next/navigation'
import DeletePreguntaButton from './components/DeletePreguntaButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PreguntasPage({ params }: Props) {
  const { id } = await params
  const [cuestionario, preguntas] = await Promise.all([
    obtenerCuestionario(id),
    obtenerPreguntas(id)
  ])

  if (!cuestionario) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Preguntas</h1>
        <h2 className="text-xl text-gray-600">{cuestionario.titulo}</h2>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Link 
          href="/cuestionarios"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Volver a Cuestionarios
        </Link>
        <Link 
          href={`/cuestionarios/${id}/preguntas/nueva`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nueva Pregunta
        </Link>
      </div>

      <div className="space-y-4">
        {preguntas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay preguntas disponibles para este cuestionario
          </div>
        ) : (
          preguntas.map((pregunta) => (
            <div key={pregunta._id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                      #{pregunta.orden}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">{pregunta.pregunta}</h3>
                  <div className="bg-gray-50 p-3 rounded mb-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Respuesta correcta:</p>
                    <code className="block bg-gray-100 p-2 rounded text-sm font-mono">
                      {pregunta.respuestaCorrecta}
                    </code>
                  </div>
                  {pregunta.explicacion && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium text-blue-700 mb-1">Explicación:</p>
                      <p className="text-sm text-blue-600">{pregunta.explicacion}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/cuestionarios/${id}/preguntas/${pregunta._id}/editar`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Editar
                  </Link>
                  <DeletePreguntaButton preguntaId={pregunta._id!} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}