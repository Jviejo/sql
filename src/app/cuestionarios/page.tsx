import Link from 'next/link'
import { obtenerCuestionarios } from '@/actions/cuestionarios'
import DeleteButton from './components/DeleteButton'

export default async function CuestionariosPage() {
  const cuestionarios = await obtenerCuestionarios()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cuestionarios</h1>
        <Link 
          href="/cuestionarios/nuevo"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nuevo Cuestionario
        </Link>
      </div>

      <div className="grid gap-4">
        {cuestionarios.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay cuestionarios disponibles
          </div>
        ) : (
          cuestionarios.map((cuestionario) => (
            <div key={cuestionario._id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{cuestionario.titulo}</h2>
                  {cuestionario.descripcion && (
                    <p className="text-gray-600 mb-2">{cuestionario.descripcion}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Creado: {new Date(cuestionario.fechaCreacion).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/cuestionarios/${cuestionario._id}/resolver`}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Resolver
                  </Link>
                  <Link
                    href={`/cuestionarios/${cuestionario._id}/preguntas`}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                  >
                    Preguntas
                  </Link>
                  <Link
                    href={`/cuestionarios/${cuestionario._id}/editar`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Editar
                  </Link>
                  <DeleteButton cuestionarioId={cuestionario._id!} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}