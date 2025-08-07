'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BatchQuestion {
  pregunta: string
  respuestaCorrecta: string
  explicacion: string
  orden: number
}

interface BatchForm {
  nombreCuestionario: string
  descripcion: string
  preguntas: BatchQuestion[]
}

export default function BatchUploadButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'file' | 'textarea'>('file')
  const [jsonText, setJsonText] = useState('')
  const router = useRouter()

  const processBatchData = async (batchData: BatchForm) => {
    setIsLoading(true)
    setError('')

    try {
      // Validar estructura del archivo
      if (!batchData.nombreCuestionario || !batchData.preguntas || !Array.isArray(batchData.preguntas)) {
        throw new Error('Formato inválido. Debe contener nombreCuestionario y preguntas.')
      }

      // Crear el cuestionario
      const response = await fetch('/api/cuestionarios/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear el cuestionario')
      }

      const result = await response.json()
      setIsModalOpen(false)
      setJsonText('')
      router.push(`/cuestionarios/${result.cuestionarioId}/preguntas`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar los datos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const batchData: BatchForm = JSON.parse(text)
      await processBatchData(batchData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el archivo')
    }
  }

  const handleTextareaSubmit = async () => {
    if (!jsonText.trim()) {
      setError('Por favor, ingresa el JSON en el textarea')
      return
    }

    try {
      const batchData: BatchForm = JSON.parse(jsonText)
      await processBatchData(batchData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el JSON')
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
      >
        Cargar Batch
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Cargar Cuestionario Batch</h3>
            
            {/* Pestañas */}
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab('file')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'file'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cargar Archivo
              </button>
              <button
                onClick={() => setActiveTab('textarea')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'textarea'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pegar JSON
              </button>
            </div>

            {/* Contenido de las pestañas */}
            {activeTab === 'file' && (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Selecciona un archivo JSON con el siguiente formato:
                  </p>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`{
  "nombreCuestionario": "Nombre del cuestionario",
  "descripcion": "Descripción del cuestionario",
  "preguntas": [
    {
      "pregunta": "Texto de la pregunta",
      "respuestaCorrecta": "SELECT ...",
      "explicacion": "Explicación de la respuesta",
      "orden": 1
    }
  ]
}`}
                  </pre>
                </div>

                <div className="mb-4">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="w-full p-2 border rounded"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {activeTab === 'textarea' && (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Pega el JSON directamente en el siguiente textarea:
                  </p>
                  <textarea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    className="w-full h-64 p-3 border rounded font-mono text-sm"
                    placeholder={`{
  "nombreCuestionario": "Nombre del cuestionario",
  "descripcion": "Descripción del cuestionario",
  "preguntas": [
    {
      "pregunta": "Texto de la pregunta",
      "respuestaCorrecta": "SELECT ...",
      "explicacion": "Explicación de la respuesta",
      "orden": 1
    }
  ]
}`}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={handleTextareaSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={isLoading || !jsonText.trim()}
                  >
                    Procesar JSON
                  </button>
                  <button
                    onClick={() => setJsonText('')}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    disabled={isLoading}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="mb-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Procesando datos...</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setJsonText('')
                  setError('')
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 