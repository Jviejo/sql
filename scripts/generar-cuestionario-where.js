const { MongoClient } = require('mongodb')

// if (!process.env.MONGODB_URI) {
//   console.error('Error: MONGODB_URI no está definida en las variables de entorno')
//   process.exit(1)
// }

const preguntas = [
  {
    pregunta: "Obtén todos los productos que tengan un precio unitario mayor a 20 dólares",
    respuestaCorrecta: "SELECT * FROM products WHERE unit_price > 20;",
    explicacion: "Usa WHERE con el operador > para filtrar productos con precio mayor a 20",
    orden: 1
  },
  {
    pregunta: "Encuentra todos los empleados que viven en la ciudad de 'London'",
    respuestaCorrecta: "SELECT * FROM employees WHERE city = 'London';",
    explicacion: "Para texto usa comillas simples y el operador = para igualdad exacta",
    orden: 2
  },
  {
    pregunta: "Obtén todos los pedidos realizados por el cliente con ID 'ALFKI'",
    respuestaCorrecta: "SELECT * FROM orders WHERE customer_id = 'ALFKI';",
    explicacion: "Los IDs de cliente son strings, por lo que deben ir entre comillas",
    orden: 3
  },
  {
    pregunta: "Encuentra todos los productos que estén descontinuados (discontinued = 1)",
    respuestaCorrecta: "SELECT * FROM products WHERE discontinued = 1;",
    explicacion: "El campo discontinued es numérico: 1 = descontinuado, 0 = activo",
    orden: 4
  },
  {
    pregunta: "Obtén todos los proveedores que están en el país 'USA'",
    respuestaCorrecta: "SELECT * FROM suppliers WHERE country = 'USA';",
    explicacion: "Filtra por el campo country usando comillas para el valor de texto",
    orden: 5
  },
  {
    pregunta: "Encuentra todos los productos que tengan menos de 10 unidades en stock",
    respuestaCorrecta: "SELECT * FROM products WHERE units_in_stock < 10;",
    explicacion: "Usa el operador < para 'menor que' con valores numéricos",
    orden: 6
  },
  {
    pregunta: "Obtén todos los empleados contratados después del 1 de enero de 1993",
    respuestaCorrecta: "SELECT * FROM employees WHERE hire_date > '1993-01-01';",
    explicacion: "Para fechas usa formato 'YYYY-MM-DD' y el operador > para 'después de'",
    orden: 7
  },
  {
    pregunta: "Encuentra todos los pedidos con un freight (costo de envío) mayor o igual a 50",
    respuestaCorrecta: "SELECT * FROM orders WHERE freight >= 50;",
    explicacion: "El operador >= significa 'mayor o igual que'",
    orden: 8
  },
  {
    pregunta: "Obtén todas las categorías que contengan la palabra 'Dairy' en su nombre",
    respuestaCorrecta: "SELECT * FROM categories WHERE category_name LIKE '%Dairy%';",
    explicacion: "LIKE con % permite buscar texto que contenga una palabra específica",
    orden: 9
  },
  {
    pregunta: "Encuentra todos los clientes cuyo código postal no sea nulo",
    respuestaCorrecta: "SELECT * FROM customers WHERE postal_code IS NOT NULL;",
    explicacion: "Para verificar valores no nulos usa 'IS NOT NULL', no '!= NULL'",
    orden: 10
  }
]

async function crearCuestionario() {
  const client = new MongoClient('mongodb://localhost:27017/formacion')
  
  try {
    await client.connect()
    console.log('Conectado a MongoDB')
    
    const db = client.db('formacion')
    const cuestionariosCollection = db.collection('cuestionarios')
    const preguntasCollection = db.collection('preguntas')
    
    // Crear el cuestionario
    const cuestionario = {
      titulo: 'Query a una tabla con WHERE',
      descripcion: 'Practica consultas SQL básicas usando la cláusula WHERE con diferentes operadores y tipos de datos',
      fechaCreacion: new Date(),
      activo: true
    }
    
    const resultCuestionario = await cuestionariosCollection.insertOne(cuestionario)
    const cuestionarioId = resultCuestionario.insertedId
    
    console.log(`✅ Cuestionario creado con ID: ${cuestionarioId}`)
    
    // Crear las preguntas
    const preguntasConId = preguntas.map(pregunta => ({
      ...pregunta,
      cuestionarioId: cuestionarioId,
      fechaCreacion: new Date()
    }))
    
    const resultPreguntas = await preguntasCollection.insertMany(preguntasConId)
    
    console.log(`✅ ${resultPreguntas.insertedCount} preguntas creadas`)
    console.log('🎉 Cuestionario "Query a una tabla con WHERE" generado exitosamente')
    
    // Mostrar resumen
    console.log('\n📊 Resumen del cuestionario:')
    console.log(`Título: ${cuestionario.titulo}`)
    console.log(`Descripción: ${cuestionario.descripcion}`)
    console.log(`Número de preguntas: ${preguntas.length}`)
    console.log('\n🔗 Tipos de consultas incluidas:')
    console.log('- Comparaciones numéricas (>, <, >=)')
    console.log('- Comparaciones de texto (=)')
    console.log('- Comparaciones de fechas')
    console.log('- Búsquedas con LIKE')
    console.log('- Verificación de valores NULL')
    
  } catch (error) {
    console.error('❌ Error creando el cuestionario:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('\n🔌 Conexión a MongoDB cerrada')
  }
}

// Ejecutar el script
crearCuestionario().catch(console.error)