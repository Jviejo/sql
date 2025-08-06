'use client'

export default function AuthInfo() {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-medium text-blue-900 mb-2">
        Información del Sistema de Autenticación
      </h3>
      
      <div className="text-sm text-blue-800 space-y-2">
        <p>
          <strong>Modo:</strong> {isDevelopment ? 'Desarrollo' : 'Producción'}
        </p>
        
        {isDevelopment ? (
          <div>
            <p><strong>Email en desarrollo:</strong> MailHog</p>
            <p className="text-xs">
              • Instala MailHog: <code className="bg-blue-100 px-1 rounded">brew install mailhog</code>
            </p>
            <p className="text-xs">
              • Inicia MailHog: <code className="bg-blue-100 px-1 rounded">mailhog</code>
            </p>
            <p className="text-xs">
              • Accede a la interfaz: <a href="http://localhost:8025" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">http://localhost:8025</a>
            </p>
          </div>
        ) : (
          <div>
            <p><strong>Email en producción:</strong> Resend</p>
            <p className="text-xs">
              • Los emails se envían a través de Resend
            </p>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs">
            <strong>Flujo de autenticación:</strong>
          </p>
          <ol className="text-xs list-decimal list-inside space-y-1 mt-1">
            <li>Ingresa tu email</li>
            <li>Recibe un código de 6 dígitos por email</li>
            <li>Ingresa el código para verificar</li>
            <li>Si no tienes cuenta, se crea automáticamente</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 