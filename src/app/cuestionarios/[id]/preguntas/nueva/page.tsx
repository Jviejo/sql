import { crearPregunta, obtenerPreguntas } from '@/actions/preguntas'
import { obtenerCuestionario } from '@/actions/cuestionarios'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function NuevaPreguntaPage({ params }: Props) {
  const { id } = await params
  const [cuestionario, preguntas] = await Promise.all([
    obtenerCuestionario(id),
    obtenerPreguntas(id)
  ])
  
  if (!cuestionario) {
    notFound()
  }

  const siguienteOrden = preguntas.length > 0 ? Math.max(...preguntas.map(p => p.orden)) + 1 : 1

  async function handleSubmit(formData: FormData) {
    'use server'
    formData.set('cuestionarioId', id)
    const result = await crearPregunta(formData)
    if (result.success) {
      redirect(`/cuestionarios/${id}/preguntas`)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Nueva Pregunta</h1>
        <h2 className="text-xl text-gray-600">{cuestionario.titulo}</h2>
      </div>
      
      <form action={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label htmlFor="pregunta" className="block text-sm font-medium mb-1">
            Pregunta *
          </label>
          <textarea
            id="pregunta"
            name="pregunta"
            required
            rows={3}
            className="w-full border rounded px-3 py-2"
            placeholder="Escribe la pregunta SQL aquí..."
          />
        </div>

        <div>
          <label htmlFor="respuestaCorrecta" className="block text-sm font-medium mb-1">
            Consulta SQL Correcta *
          </label>
          <textarea
            id="respuestaCorrecta"
            name="respuestaCorrecta"
            required
            rows={4}
            className="w-full border rounded px-3 py-2 font-mono text-sm"
            placeholder="SELECT * FROM tabla WHERE condicion;"
          />
        </div>

        <div>
          <label htmlFor="explicacion" className="block text-sm font-medium mb-1">
            Explicación (opcional)
          </label>
          <textarea
            id="explicacion"
            name="explicacion"
            rows={3}
            className="w-full border rounded px-3 py-2"
            placeholder="Explicación de la solución..."
          />
        </div>

        <div>
          <label htmlFor="orden" className="block text-sm font-medium mb-1">
            Orden *
          </label>
          <input
            type="number"
            id="orden"
            name="orden"
            required
            min="1"
            defaultValue={siguienteOrden}
            className="w-20 border rounded px-3 py-2"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Crear Pregunta
          </button>
          <a
            href={`/cuestionarios/${id}/preguntas`}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}