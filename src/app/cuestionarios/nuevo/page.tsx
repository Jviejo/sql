import { crearCuestionario, obtenerCuestionarios } from '@/actions/cuestionarios'
import { redirect } from 'next/navigation'

export default async function NuevoCuestionarioPage() {
  // Obtener el siguiente orden
  const cuestionarios = await obtenerCuestionarios()
  const siguienteOrden = cuestionarios.length > 0 ? Math.max(...cuestionarios.map(c => c.orden)) + 1 : 1

  async function handleSubmit(formData: FormData) {
    'use server'
    const result = await crearCuestionario(formData)
    if (result.success) {
      redirect('/cuestionarios')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Cuestionario</h1>
      
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
            className="w-full border rounded px-3 py-2"
            placeholder="Descripción opcional del cuestionario"
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
            Crear Cuestionario
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