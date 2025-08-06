# Configuración del Sistema de Autenticación

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/your_database_name

# JWT Secret (generate a secure random string)
JWT_SECRET=3b0fe6416f8ef608da11e489cf7e1f1a717b39861c0359a2c7640fa75d08e27e

# Environment
NODE_ENV=development

# Email Configuration (for production)
RESEND_API_KEY=your-resend-api-key
```

## Configuración de la Base de Datos

El sistema usa MongoDB para almacenar los usuarios. La colección se llama `users` y se crea automáticamente cuando se registra el primer usuario.

### Estructura de la Colección `users`

```javascript
{
  _id: ObjectId,
  email: String (único),
  role: String ("user" | "admin"),
  createdAt: Date,
  updatedAt: Date
}
```

### Crear un Usuario Admin

#### Opción 1: Usando el script automático

```bash
npm run create-admin
```

Este script creará un usuario admin con email `admin@example.com` si no existe ninguno.

#### Opción 2: Manualmente en MongoDB

```javascript
// Conectar a MongoDB
mongosh

// Seleccionar la base de datos
use your_database_name

// Insertar usuario admin
db.users.insertOne({
  email: "admin@example.com",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Configuración de Email

### Desarrollo (MailHog)

Para desarrollo local con MailHog:

1. Instala MailHog:
   ```bash
   # macOS con Homebrew
   brew install mailhog
   ```

2. Inicia MailHog:
   ```bash
   mailhog
   ```

3. Accede a la interfaz web de MailHog en: http://localhost:8025

### Producción (Resend)

1. Crea una cuenta en [Resend](https://resend.com)
2. Obtén tu API key
3. Configura la variable `RESEND_API_KEY` en tu archivo `.env.local`

## Uso del Sistema

### Flujo de Autenticación

1. El usuario accede a la aplicación
2. Si no está autenticado, es redirigido a `/login`
3. Ingresa su email
4. **Desarrollo**: Se envía un código de 6 dígitos por MailHog
5. **Producción**: Se envía un código de 6 dígitos por Resend
6. El usuario revisa su email y copia el código
7. Ingresa el código en la aplicación
8. Si el usuario no existe, se crea automáticamente con rol 'user'
9. Se genera un JWT token y se almacena en localStorage

### Roles de Usuario

- **user**: Puede resolver cuestionarios
- **admin**: Puede crear, editar, borrar cuestionarios y gestionar usuarios

### Rutas Protegidas

- `/admin/users` - Solo accesible para administradores
- Todas las rutas de cuestionarios requieren autenticación

## Características del Sistema

- ✅ Autenticación basada en email
- ✅ Códigos de verificación de 6 dígitos
- ✅ MailHog para emails en desarrollo
- ✅ Resend para emails en producción
- ✅ JWT tokens para sesiones
- ✅ Roles de usuario (user/admin)
- ✅ Gestión de usuarios (solo admins)
- ✅ Creación automática de usuarios
- ✅ Protección de rutas
- ✅ Interfaz de usuario moderna
- ✅ MongoDB para almacenamiento de usuarios
- ✅ Códigos con expiración de 10 minutos

## Troubleshooting

### Problemas con la Base de Datos

1. Verifica que MongoDB esté ejecutándose
2. Verifica la conexión a MongoDB
3. Verifica las variables de entorno
4. Verifica que la colección `users` existe

### Problemas con JWT

1. Verifica que `JWT_SECRET` esté configurado
2. Verifica que el token no haya expirado
3. Limpia localStorage si hay problemas de autenticación

### Problemas con MongoDB

1. Verifica que MongoDB esté ejecutándose:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # O manualmente
   mongod
   ```

2. Verifica la URI de conexión en `MONGODB_URI`
3. Verifica que la base de datos y colección existan

### Problemas con Email

#### Desarrollo (MailHog)
1. Verifica que MailHog esté ejecutándose:
   ```bash
   mailhog
   ```
2. Accede a http://localhost:8025 para ver los emails
3. Verifica que el puerto 1025 esté disponible

#### Producción (Resend)
1. Verifica que `RESEND_API_KEY` esté configurado
2. Verifica que el dominio esté verificado en Resend
3. Revisa los logs del servidor para errores de email

### Crear Usuario Admin

Si necesitas crear un usuario admin:

```bash
# Usar el script automático
npm run create-admin

# O manualmente en MongoDB
mongosh
use your_database_name
db.users.insertOne({
  email: "tu-email@ejemplo.com",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Ventajas del Sistema

### Desarrollo con MailHog
- **Realista**: Simula el flujo real de email
- **Fácil de debuggear**: Interfaz web para ver emails
- **Sin spam**: No se envían emails reales
- **Rápido**: No hay delays de red

### Producción con Resend
- **Seguro**: Emails reales con códigos de expiración
- **Profesional**: Flujo completo de autenticación
- **Escalable**: Puede manejar múltiples usuarios
- **Auditable**: Logs de envío de emails 