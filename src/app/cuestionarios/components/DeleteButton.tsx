'use client'

import { eliminarCuestionario } from '@/actions/cuestionarios'

interface DeleteButtonProps {
  cuestionarioId: string
}

export default function DeleteButton({ cuestionarioId }: DeleteButtonProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!confirm('¿Estás seguro de que quieres eliminar este cuestionario?')) {
      return
    }

    try {
      await eliminarCuestionario(cuestionarioId)
    } catch (error) {
      console.error('Error eliminando cuestionario:', error)
      alert('Error al eliminar el cuestionario')
    }
  }

  return (
    <button
      onClick={handleClick}
      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
    >
      Eliminar
    </button>
  )
}