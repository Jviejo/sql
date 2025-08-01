import { obtenerCuestionario, actualizarCuestionario } from '@/actions/cuestionarios'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarCuestionarioPage({ params }: Props) {
  const { id } = await params
  const cuestionario = await obtenerCuestionario(id)
  
  if (!cuestionario) {
    notFound()
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    const result = await actualizarCuestionario(id, formData)
    if (result.success) {
      redirect('/cuestionarios')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Editar Cuestionario</h1>
      
      <form action={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium mb-1">
            Título *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            required
            defaultValue={cuestionario.titulo}
            className="w-full border rounded px-3 py-2"
            placeholder="Título del cuestionario"
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            defaultValue={cuestionario.descripcion || ''}
            className="w-full border rounded px-3 py-2"
            placeholder="Descripción opcional del cuestionario"
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
            href="/cuestionarios"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}