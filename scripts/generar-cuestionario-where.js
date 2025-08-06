const { MongoClient } = require('mongodb')

// MongoDB connection
const client = new MongoClient('mongodb://localhost:27017/formacion')

// Questions for WHERE clause
const preguntasWhere = [
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

// Questions for WHERE with functions
const preguntasWhereFunciones = [
  {
    pregunta: "Encuentra todos los empleados cuyo apellido comience con 'S'",
    respuestaCorrecta: "SELECT * FROM employees WHERE last_name LIKE 'S%';",
    explicacion: "LIKE con % al final busca strings que comiencen con 'S'",
    orden: 1
  },
  {
    pregunta: "Obtén todos los productos cuyo nombre termine con 's'",
    respuestaCorrecta: "SELECT * FROM products WHERE product_name LIKE '%s';",
    explicacion: "LIKE con % al inicio busca strings que terminen con 's'",
    orden: 2
  },
  {
    pregunta: "Encuentra todos los clientes cuyo nombre de empresa contenga 'Food'",
    respuestaCorrecta: "SELECT * FROM customers WHERE company_name LIKE '%Food%';",
    explicacion: "LIKE con % al inicio y final busca strings que contengan 'Food'",
    orden: 3
  },
  {
    pregunta: "Obtén todos los empleados cuyo título contenga la palabra 'Manager'",
    respuestaCorrecta: "SELECT * FROM employees WHERE title LIKE '%Manager%';",
    explicacion: "LIKE con % permite buscar palabras dentro del texto",
    orden: 4
  },
  {
    pregunta: "Encuentra todos los productos con precio unitario entre 10 y 50",
    respuestaCorrecta: "SELECT * FROM products WHERE unit_price BETWEEN 10 AND 50;",
    explicacion: "BETWEEN incluye los valores límite (10 y 50)",
    orden: 5
  },
  {
    pregunta: "Obtén todos los empleados contratados entre 1992 y 1994",
    respuestaCorrecta: "SELECT * FROM employees WHERE hire_date BETWEEN '1992-01-01' AND '1994-12-31';",
    explicacion: "BETWEEN funciona también con fechas usando formato 'YYYY-MM-DD'",
    orden: 6
  },
  {
    pregunta: "Encuentra todos los clientes que no estén en 'USA'",
    respuestaCorrecta: "SELECT * FROM customers WHERE country != 'USA';",
    explicacion: "El operador != significa 'diferente de'",
    orden: 7
  },
  {
    pregunta: "Obtén todos los productos que no estén descontinuados",
    respuestaCorrecta: "SELECT * FROM products WHERE discontinued != 1;",
    explicacion: "!= 1 es equivalente a = 0 para productos activos",
    orden: 8
  },
  {
    pregunta: "Encuentra todos los empleados que no reporten a nadie (reports_to IS NULL)",
    respuestaCorrecta: "SELECT * FROM employees WHERE reports_to IS NULL;",
    explicacion: "IS NULL verifica valores nulos, no usa = NULL",
    orden: 9
  },
  {
    pregunta: "Obtén todos los pedidos que no tengan fecha de envío",
    respuestaCorrecta: "SELECT * FROM orders WHERE shipped_date IS NULL;",
    explicacion: "IS NULL verifica que el campo no tenga valor asignado",
    orden: 10
  }
]

// Questions for JOIN with WHERE and functions
const preguntasJoinWhere = [
  {
    pregunta: "Obtén el nombre del producto y su categoría para productos con precio > 20",
    respuestaCorrecta: "SELECT p.product_name, c.category_name FROM products p JOIN categories c ON p.category_id = c.category_id WHERE p.unit_price > 20;",
    explicacion: "JOIN conecta productos con categorías y WHERE filtra por precio",
    orden: 1
  },
  {
    pregunta: "Encuentra empleados y sus territorios para empleados de 'London'",
    respuestaCorrecta: "SELECT e.first_name, e.last_name, t.territory_description FROM employees e JOIN employee_territories et ON e.employee_id = et.employee_id JOIN territories t ON et.territory_id = t.territory_id WHERE e.city = 'London';",
    explicacion: "Múltiples JOINs conectan empleados con territorios",
    orden: 2
  },
  {
    pregunta: "Obtén pedidos con información del cliente para clientes de 'Germany'",
    respuestaCorrecta: "SELECT o.order_id, c.company_name FROM orders o JOIN customers c ON o.customer_id = c.customer_id WHERE c.country = 'Germany';",
    explicacion: "JOIN conecta pedidos con clientes, WHERE filtra por país",
    orden: 3
  },
  {
    pregunta: "Encuentra productos con su proveedor para proveedores de 'USA'",
    respuestaCorrecta: "SELECT p.product_name, s.company_name FROM products p JOIN suppliers s ON p.supplier_id = s.supplier_id WHERE s.country = 'USA';",
    explicacion: "JOIN conecta productos con proveedores",
    orden: 4
  },
  {
    pregunta: "Obtén detalles de pedidos con información del producto para productos descontinuados",
    respuestaCorrecta: "SELECT od.order_id, p.product_name, od.quantity FROM order_details od JOIN products p ON od.product_id = p.product_id WHERE p.discontinued = 1;",
    explicacion: "JOIN conecta detalles de pedidos con productos",
    orden: 5
  },
  {
    pregunta: "Encuentra empleados con su jefe para empleados contratados después de 1993",
    respuestaCorrecta: "SELECT e.first_name, e.last_name, j.first_name as jefe_nombre FROM employees e LEFT JOIN employees j ON e.reports_to = j.employee_id WHERE e.hire_date > '1993-01-01';",
    explicacion: "LEFT JOIN incluye empleados sin jefe, WHERE filtra por fecha",
    orden: 6
  },
  {
    pregunta: "Obtén pedidos con información del empleado para empleados con título 'Manager'",
    respuestaCorrecta: "SELECT o.order_id, e.first_name, e.last_name FROM orders o JOIN employees e ON o.employee_id = e.employee_id WHERE e.title LIKE '%Manager%';",
    explicacion: "JOIN conecta pedidos con empleados, WHERE filtra por título",
    orden: 7
  },
  {
    pregunta: "Encuentra productos con su categoría para categorías que contengan 'Food'",
    respuestaCorrecta: "SELECT p.product_name, c.category_name FROM products p JOIN categories c ON p.category_id = c.category_id WHERE c.category_name LIKE '%Food%';",
    explicacion: "JOIN conecta productos con categorías, WHERE filtra por nombre de categoría",
    orden: 8
  },
  {
    pregunta: "Obtén pedidos con información del cliente para clientes sin código postal",
    respuestaCorrecta: "SELECT o.order_id, c.company_name FROM orders o JOIN customers c ON o.customer_id = c.customer_id WHERE c.postal_code IS NULL;",
    explicacion: "JOIN conecta pedidos con clientes, WHERE filtra por valores nulos",
    orden: 9
  },
  {
    pregunta: "Encuentra productos con su proveedor para proveedores con fax",
    respuestaCorrecta: "SELECT p.product_name, s.company_name FROM products p JOIN suppliers s ON p.supplier_id = s.supplier_id WHERE s.fax IS NOT NULL;",
    explicacion: "JOIN conecta productos con proveedores, WHERE filtra por valores no nulos",
    orden: 10
  }
]

// Questions for GROUP BY and HAVING
const preguntasGroupBy = [
  {
    pregunta: "Cuenta cuántos productos hay por categoría",
    respuestaCorrecta: "SELECT c.category_name, COUNT(*) as total_productos FROM products p JOIN categories c ON p.category_id = c.category_id GROUP BY c.category_name;",
    explicacion: "GROUP BY agrupa por categoría, COUNT cuenta productos",
    orden: 1
  },
  {
    pregunta: "Calcula el precio promedio por categoría para categorías con más de 5 productos",
    respuestaCorrecta: "SELECT c.category_name, AVG(p.unit_price) as precio_promedio FROM products p JOIN categories c ON p.category_id = c.category_id GROUP BY c.category_name HAVING COUNT(*) > 5;",
    explicacion: "GROUP BY agrupa por categoría, HAVING filtra grupos con más de 5 productos",
    orden: 2
  },
  {
    pregunta: "Encuentra el total de ventas por cliente para clientes con más de 3 pedidos",
    respuestaCorrecta: "SELECT c.company_name, COUNT(o.order_id) as total_pedidos FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.company_name HAVING COUNT(o.order_id) > 3;",
    explicacion: "GROUP BY agrupa por cliente, HAVING filtra por número de pedidos",
    orden: 3
  },
  {
    pregunta: "Calcula el número de empleados por ciudad para ciudades con más de 1 empleado",
    respuestaCorrecta: "SELECT city, COUNT(*) as total_empleados FROM employees GROUP BY city HAVING COUNT(*) > 1;",
    explicacion: "GROUP BY agrupa por ciudad, HAVING filtra ciudades con múltiples empleados",
    orden: 4
  },
  {
    pregunta: "Encuentra el precio máximo por categoría para categorías con productos activos",
    respuestaCorrecta: "SELECT c.category_name, MAX(p.unit_price) as precio_maximo FROM products p JOIN categories c ON p.category_id = c.category_id WHERE p.discontinued = 0 GROUP BY c.category_name;",
    explicacion: "WHERE filtra productos activos, GROUP BY agrupa por categoría",
    orden: 5
  },
  {
    pregunta: "Calcula el total de unidades en stock por proveedor para proveedores con más de 2 productos",
    respuestaCorrecta: "SELECT s.company_name, SUM(p.units_in_stock) as total_stock FROM products p JOIN suppliers s ON p.supplier_id = s.supplier_id GROUP BY s.company_name HAVING COUNT(p.product_id) > 2;",
    explicacion: "GROUP BY agrupa por proveedor, HAVING filtra por número de productos",
    orden: 6
  },
  {
    pregunta: "Encuentra el número de pedidos por año para años con más de 10 pedidos",
    respuestaCorrecta: "SELECT EXTRACT(YEAR FROM order_date) as año, COUNT(*) as total_pedidos FROM orders GROUP BY EXTRACT(YEAR FROM order_date) HAVING COUNT(*) > 10;",
    explicacion: "EXTRACT obtiene el año, GROUP BY agrupa por año, HAVING filtra por cantidad",
    orden: 7
  },
  {
    pregunta: "Calcula el precio promedio por proveedor para proveedores de 'USA'",
    respuestaCorrecta: "SELECT s.company_name, AVG(p.unit_price) as precio_promedio FROM products p JOIN suppliers s ON p.supplier_id = s.supplier_id WHERE s.country = 'USA' GROUP BY s.company_name;",
    explicacion: "WHERE filtra proveedores de USA, GROUP BY agrupa por proveedor",
    orden: 8
  },
  {
    pregunta: "Encuentra el total de descuentos por pedido para pedidos con descuento mayor a 0.1",
    respuestaCorrecta: "SELECT order_id, SUM(discount) as total_descuento FROM order_details GROUP BY order_id HAVING SUM(discount) > 0.1;",
    explicacion: "GROUP BY agrupa por pedido, HAVING filtra por total de descuento",
    orden: 9
  },
  {
    pregunta: "Calcula el número de productos por categoría para categorías con productos en stock",
    respuestaCorrecta: "SELECT c.category_name, COUNT(*) as total_productos FROM products p JOIN categories c ON p.category_id = c.category_id WHERE p.units_in_stock > 0 GROUP BY c.category_name;",
    explicacion: "WHERE filtra productos con stock, GROUP BY agrupa por categoría",
    orden: 10
  }
]

// Questions for Window Functions
const preguntasWindowFunctions = [
  {
    pregunta: "Obtén el ranking de productos por precio unitario dentro de cada categoría",
    respuestaCorrecta: "SELECT product_name, category_id, unit_price, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY unit_price DESC) as ranking FROM products;",
    explicacion: "ROW_NUMBER() asigna números secuenciales, PARTITION BY agrupa por categoría",
    orden: 1
  },
  {
    pregunta: "Calcula el precio promedio de productos por categoría usando ventana",
    respuestaCorrecta: "SELECT product_name, category_id, unit_price, AVG(unit_price) OVER (PARTITION BY category_id) as precio_promedio_categoria FROM products;",
    explicacion: "AVG() OVER calcula el promedio por categoría sin agrupar",
    orden: 2
  },
  {
    pregunta: "Encuentra el producto más caro de cada categoría usando RANK",
    respuestaCorrecta: "SELECT product_name, category_id, unit_price, RANK() OVER (PARTITION BY category_id ORDER BY unit_price DESC) as ranking FROM products;",
    explicacion: "RANK() asigna el mismo rango a valores iguales",
    orden: 3
  },
  {
    pregunta: "Calcula la diferencia entre el precio de cada producto y el precio promedio de su categoría",
    respuestaCorrecta: "SELECT product_name, unit_price, unit_price - AVG(unit_price) OVER (PARTITION BY category_id) as diferencia_promedio FROM products;",
    explicacion: "Resta el precio individual del promedio de la categoría",
    orden: 4
  },
  {
    pregunta: "Obtén el top 3 de empleados por fecha de contratación en cada ciudad",
    respuestaCorrecta: "SELECT first_name, last_name, city, hire_date, ROW_NUMBER() OVER (PARTITION BY city ORDER BY hire_date) as ranking FROM employees;",
    explicacion: "ROW_NUMBER() ordena por fecha de contratación dentro de cada ciudad",
    orden: 5
  },
  {
    pregunta: "Calcula el porcentaje del total de ventas que representa cada pedido",
    respuestaCorrecta: "SELECT order_id, freight, freight * 100.0 / SUM(freight) OVER () as porcentaje_total FROM orders;",
    explicacion: "Calcula el porcentaje dividiendo el freight individual por el total",
    orden: 6
  },
  {
    pregunta: "Encuentra el cliente con más pedidos usando DENSE_RANK",
    respuestaCorrecta: "SELECT customer_id, COUNT(*) as total_pedidos, DENSE_RANK() OVER (ORDER BY COUNT(*) DESC) as ranking FROM orders GROUP BY customer_id;",
    explicacion: "DENSE_RANK() no deja huecos en el ranking",
    orden: 7
  },
  {
    pregunta: "Calcula el precio acumulado de productos ordenados por precio",
    respuestaCorrecta: "SELECT product_name, unit_price, SUM(unit_price) OVER (ORDER BY unit_price ROWS UNBOUNDED PRECEDING) as precio_acumulado FROM products;",
    explicacion: "ROWS UNBOUNDED PRECEDING suma todos los valores anteriores",
    orden: 8
  },
  {
    pregunta: "Obtén el precio máximo y mínimo por categoría usando ventanas",
    respuestaCorrecta: "SELECT product_name, category_id, unit_price, MAX(unit_price) OVER (PARTITION BY category_id) as max_precio, MIN(unit_price) OVER (PARTITION BY category_id) as min_precio FROM products;",
    explicacion: "Múltiples funciones de ventana en la misma consulta",
    orden: 9
  },
  {
    pregunta: "Calcula el percentil 75 del precio de productos por categoría",
    respuestaCorrecta: "SELECT product_name, category_id, unit_price, PERCENTILE_CONT(0.75) OVER (PARTITION BY category_id ORDER BY unit_price) as percentil_75 FROM products;",
    explicacion: "PERCENTILE_CONT calcula el percentil 75 por categoría",
    orden: 10
  }
]

// Questions for WITH statements (CTEs)
const preguntasWith = [
  {
    pregunta: "Usando WITH, encuentra productos con precio mayor al promedio de su categoría",
    respuestaCorrecta: "WITH promedios_categoria AS (SELECT category_id, AVG(unit_price) as precio_promedio FROM products GROUP BY category_id) SELECT p.product_name, p.unit_price, pc.precio_promedio FROM products p JOIN promedios_categoria pc ON p.category_id = pc.category_id WHERE p.unit_price > pc.precio_promedio;",
    explicacion: "WITH crea una CTE temporal con promedios por categoría",
    orden: 1
  },
  {
    pregunta: "Usando WITH, encuentra empleados que reportan a jefes contratados después de 1993",
    respuestaCorrecta: "WITH jefes_recientes AS (SELECT employee_id FROM employees WHERE hire_date > '1993-01-01') SELECT e.first_name, e.last_name FROM employees e JOIN jefes_recientes jr ON e.reports_to = jr.employee_id;",
    explicacion: "WITH crea una CTE con jefes contratados después de 1993",
    orden: 2
  },
  {
    pregunta: "Usando WITH, encuentra clientes con más pedidos que el promedio",
    respuestaCorrecta: "WITH pedidos_por_cliente AS (SELECT customer_id, COUNT(*) as total_pedidos FROM orders GROUP BY customer_id), promedio_pedidos AS (SELECT AVG(total_pedidos) as promedio FROM pedidos_por_cliente) SELECT c.company_name, ppc.total_pedidos FROM customers c JOIN pedidos_por_cliente ppc ON c.customer_id = ppc.customer_id, promedio_pedidos WHERE ppc.total_pedidos > promedio_pedidos.promedio;",
    explicacion: "Múltiples CTEs: una para pedidos por cliente, otra para el promedio",
    orden: 3
  },
  {
    pregunta: "Usando WITH, encuentra productos con stock menor al promedio de su categoría",
    respuestaCorrecta: "WITH stock_promedio AS (SELECT category_id, AVG(units_in_stock) as stock_promedio FROM products GROUP BY category_id) SELECT p.product_name, p.units_in_stock, sp.stock_promedio FROM products p JOIN stock_promedio sp ON p.category_id = sp.category_id WHERE p.units_in_stock < sp.stock_promedio;",
    explicacion: "WITH calcula el stock promedio por categoría",
    orden: 4
  },
  {
    pregunta: "Usando WITH, encuentra empleados con salario (freight promedio) mayor al de su jefe",
    respuestaCorrecta: "WITH salarios_empleados AS (SELECT employee_id, AVG(freight) as salario_promedio FROM orders GROUP BY employee_id) SELECT e.first_name, e.last_name, se.salario_promedio FROM employees e JOIN salarios_empleados se ON e.employee_id = se.employee_id JOIN salarios_empleados sj ON e.reports_to = sj.employee_id WHERE se.salario_promedio > sj.salario_promedio;",
    explicacion: "WITH calcula salarios promedio por empleado",
    orden: 5
  },
  {
    pregunta: "Usando WITH, encuentra categorías con productos más caros que el promedio general",
    respuestaCorrecta: "WITH precio_promedio_general AS (SELECT AVG(unit_price) as precio_promedio FROM products) SELECT DISTINCT c.category_name FROM products p JOIN categories c ON p.category_id = c.category_id, precio_promedio_general WHERE p.unit_price > precio_promedio_general.precio_promedio;",
    explicacion: "WITH calcula el precio promedio general de todos los productos",
    orden: 6
  },
  {
    pregunta: "Usando WITH, encuentra proveedores con más productos que el promedio",
    respuestaCorrecta: "WITH productos_por_proveedor AS (SELECT supplier_id, COUNT(*) as total_productos FROM products GROUP BY supplier_id), promedio_productos AS (SELECT AVG(total_productos) as promedio FROM productos_por_proveedor) SELECT s.company_name, ppp.total_productos FROM suppliers s JOIN productos_por_proveedor ppp ON s.supplier_id = ppp.supplier_id, promedio_productos WHERE ppp.total_productos > promedio_productos.promedio;",
    explicacion: "Múltiples CTEs: productos por proveedor y promedio general",
    orden: 7
  },
  {
    pregunta: "Usando WITH, encuentra pedidos con freight mayor al promedio de su cliente",
    respuestaCorrecta: "WITH freight_por_cliente AS (SELECT customer_id, AVG(freight) as freight_promedio FROM orders GROUP BY customer_id) SELECT o.order_id, o.freight, fpc.freight_promedio FROM orders o JOIN freight_por_cliente fpc ON o.customer_id = fpc.customer_id WHERE o.freight > fpc.freight_promedio;",
    explicacion: "WITH calcula el freight promedio por cliente",
    orden: 8
  },
  {
    pregunta: "Usando WITH, encuentra empleados que ganan más que el promedio de su ciudad",
    respuestaCorrecta: "WITH salario_por_ciudad AS (SELECT city, AVG(freight) as salario_promedio FROM employees e JOIN orders o ON e.employee_id = o.employee_id GROUP BY city) SELECT e.first_name, e.last_name, e.city FROM employees e JOIN orders o ON e.employee_id = o.employee_id JOIN salario_por_ciudad spc ON e.city = spc.city WHERE o.freight > spc.salario_promedio;",
    explicacion: "WITH calcula el salario promedio por ciudad",
    orden: 9
  },
  {
    pregunta: "Usando WITH, encuentra productos con precio en el top 10% de su categoría",
    respuestaCorrecta: "WITH ranking_productos AS (SELECT product_name, category_id, unit_price, PERCENT_RANK() OVER (PARTITION BY category_id ORDER BY unit_price DESC) as percentil FROM products) SELECT product_name, category_id, unit_price FROM ranking_productos WHERE percentil <= 0.1;",
    explicacion: "WITH usa PERCENT_RANK para encontrar el top 10% por categoría",
    orden: 10
  }
]

// All questionnaires data
const cuestionarios = [
  {
    titulo: 'Query a una tabla con WHERE',
    descripcion: 'Practica consultas SQL básicas usando la cláusula WHERE con diferentes operadores y tipos de datos',
    preguntas: preguntasWhere
  },
  {
    titulo: 'WHERE con funciones y operadores avanzados',
    descripcion: 'Aprende a usar WHERE con funciones de texto, operadores LIKE, BETWEEN, IS NULL y comparaciones complejas',
    preguntas: preguntasWhereFunciones
  },
  {
    titulo: 'JOIN con WHERE y funciones',
    descripcion: 'Practica consultas que combinan múltiples tablas usando JOIN con filtros WHERE y funciones',
    preguntas: preguntasJoinWhere
  },
  {
    titulo: 'GROUP BY y HAVING',
    descripcion: 'Aprende a agrupar datos con GROUP BY y filtrar grupos con HAVING usando funciones de agregación',
    preguntas: preguntasGroupBy
  },
  {
    titulo: 'Window Functions',
    descripcion: 'Domina las funciones de ventana como ROW_NUMBER, RANK, DENSE_RANK y funciones de agregación con OVER',
    preguntas: preguntasWindowFunctions
  },
  {
    titulo: 'Sentencias WITH (CTEs)',
    descripcion: 'Practica el uso de Common Table Expressions (CTEs) con la cláusula WITH para consultas complejas',
    preguntas: preguntasWith
  }
]

async function crearCuestionarios() {
  try {
    await client.connect()
    console.log('Conectado a MongoDB')
    
    const db = client.db('formacion')
    const cuestionariosCollection = db.collection('cuestionarios')
    const preguntasCollection = db.collection('preguntas')
    
    // Borrar cuestionarios existentes
    await cuestionariosCollection.deleteMany({})
    await preguntasCollection.deleteMany({})
    console.log('🗑️ Cuestionarios existentes eliminados')
    
    // Crear nuevos cuestionarios
    for (const cuestionarioData of cuestionarios) {
      // Crear el cuestionario
      const cuestionario = {
        titulo: cuestionarioData.titulo,
        descripcion: cuestionarioData.descripcion,
        fechaCreacion: new Date(),
        activo: true
      }
      
      const resultCuestionario = await cuestionariosCollection.insertOne(cuestionario)
      const cuestionarioId = resultCuestionario.insertedId
      
      console.log(`✅ Cuestionario creado: ${cuestionario.titulo}`)
      
      // Crear las preguntas
      const preguntasConId = cuestionarioData.preguntas.map(pregunta => ({
        ...pregunta,
        cuestionarioId: cuestionarioId,
        fechaCreacion: new Date()
      }))
      
      const resultPreguntas = await preguntasCollection.insertMany(preguntasConId)
      
      console.log(`✅ ${resultPreguntas.insertedCount} preguntas creadas para: ${cuestionario.titulo}`)
    }
    
    console.log('\n🎉 Todos los cuestionarios generados exitosamente')
    
    // Mostrar resumen
    console.log('\n📊 Resumen de cuestionarios creados:')
    for (const cuestionarioData of cuestionarios) {
      console.log(`- ${cuestionarioData.titulo}: ${cuestionarioData.preguntas.length} preguntas`)
    }
    
  } catch (error) {
    console.error('❌ Error creando los cuestionarios:', error)
    process.exit(1)
  } finally {
    await client.close()
    console.log('\n🔌 Conexión a MongoDB cerrada')
  }
}

// Ejecutar el script
crearCuestionarios().catch(console.error)