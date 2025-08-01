import { obtenerPregunta, actualizarPregunta } from '@/actions/preguntas'
import { obtenerCuestionario } from '@/actions/cuestionarios'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string; preguntaId: string }>
}

export default async function EditarPreguntaPage({ params }: Props) {
  const { id, preguntaId } = await params
  const [cuestionario, pregunta] = await Promise.all([
    obtenerCuestionario(id),
    obtenerPregunta(preguntaId)
  ])
  
  if (!cuestionario || !pregunta) {
    notFound()
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    const result = await actualizarPregunta(preguntaId, formData)
    if (result.success) {
      redirect(`/cuestionarios/${id}/preguntas`)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Editar Pregunta</h1>
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
            defaultValue={pregunta.pregunta}
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
            defaultValue={pregunta.respuestaCorrecta}
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
            defaultValue={pregunta.explicacion || ''}
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
            defaultValue={pregunta.orden}
            className="w-20 border rounded px-3 py-2"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Guardar Cambios
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