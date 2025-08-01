'use client'

import { eliminarPregunta } from '@/actions/preguntas'

interface DeletePreguntaButtonProps {
  preguntaId: string
}

export default function DeletePreguntaButton({ preguntaId }: DeletePreguntaButtonProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      return
    }

    try {
      await eliminarPregunta(preguntaId)
    } catch (error) {
      console.error('Error eliminando pregunta:', error)
      alert('Error al eliminar la pregunta')
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