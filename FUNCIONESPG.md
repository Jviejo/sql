# Funciones de PostgreSQL por Categorías

## Funciones de Cadenas de Texto

### Manipulación básica
- `CONCAT(str1, str2, ...)` - Concatena cadenas
- `LENGTH(string)` - Longitud de la cadena
- `CHAR_LENGTH(string)` - Longitud en caracteres
- `LOWER(string)` - Convierte a minúsculas
- `UPPER(string)` - Convierte a mayúsculas
- `INITCAP(string)` - Primera letra en mayúscula
- `TRIM([BOTH|LEADING|TRAILING] [chars] FROM string)` - Elimina espacios o caracteres
- `LTRIM(string [, chars])` - Elimina caracteres del inicio
- `RTRIM(string [, chars])` - Elimina caracteres del final

### Búsqueda y reemplazo
- `POSITION(substring IN string)` - Posición de subcadena
- `STRPOS(string, substring)` - Posición de subcadena
- `SUBSTRING(string FROM start [FOR length])` - Extrae subcadena
- `LEFT(string, n)` - Primeros n caracteres
- `RIGHT(string, n)` - Últimos n caracteres
- `REPLACE(string, from, to)` - Reemplaza texto
- `TRANSLATE(string, from, to)` - Traduce caracteres

### Funciones avanzadas
- `SPLIT_PART(string, delimiter, field)` - Divide cadena por delimitador
- `STRING_AGG(expression, delimiter)` - Concatena valores de grupo
- `REGEXP_REPLACE(string, pattern, replacement)` - Reemplazo con regex
- `REGEXP_SPLIT_TO_ARRAY(string, pattern)` - División con regex
- `LPAD(string, length [, fill])` - Rellena por la izquierda
- `RPAD(string, length [, fill])` - Rellena por la derecha

## Funciones de Fechas y Tiempo

### Obtener fecha/hora actual
- `NOW()` - Timestamp actual con zona horaria
- `CURRENT_DATE` - Fecha actual
- `CURRENT_TIME` - Hora actual con zona horaria
- `CURRENT_TIMESTAMP` - Timestamp actual con zona horaria
- `LOCALTIME` - Hora local sin zona horaria
- `LOCALTIMESTAMP` - Timestamp local sin zona horaria

### Extracción de componentes
- `EXTRACT(field FROM source)` - Extrae componente (year, month, day, etc.)
- `DATE_PART(field, source)` - Extrae parte de fecha
- `DATE_TRUNC(field, source)` - Trunca a precisión específica
- `TO_CHAR(timestamp, format)` - Formatea fecha como texto

### Aritmética de fechas
- `AGE(timestamp, timestamp)` - Calcula diferencia de edad
- `DATE_ADD(date, INTERVAL)` - Suma intervalo a fecha
- `DATE_SUB(date, INTERVAL)` - Resta intervalo a fecha
- `MAKE_DATE(year, month, day)` - Crea fecha
- `MAKE_TIME(hour, min, sec)` - Crea hora
- `MAKE_TIMESTAMP(year, month, day, hour, min, sec)` - Crea timestamp

### Conversiones
- `TO_DATE(text, format)` - Convierte texto a fecha
- `TO_TIMESTAMP(text, format)` - Convierte texto a timestamp

## Funciones Numéricas

### Funciones matemáticas básicas
- `ABS(x)` - Valor absoluto
- `CEIL(x)` - Redondeo hacia arriba
- `FLOOR(x)` - Redondeo hacia abajo
- `ROUND(x [, precision])` - Redondeo
- `TRUNC(x [, precision])` - Truncamiento
- `MOD(x, y)` - Módulo (resto de división)
- `POWER(x, y)` - Potencia
- `SQRT(x)` - Raíz cuadrada
- `SIGN(x)` - Signo del número

### Funciones trigonométricas
- `SIN(x)`, `COS(x)`, `TAN(x)` - Funciones trigonométricas básicas
- `ASIN(x)`, `ACOS(x)`, `ATAN(x)` - Funciones trigonométricas inversas
- `ATAN2(y, x)` - Arcotangente de y/x
- `DEGREES(x)` - Convierte radianes a grados
- `RADIANS(x)` - Convierte grados a radianes
- `PI()` - Valor de π

### Funciones logarítmicas y exponenciales
- `EXP(x)` - e^x
- `LN(x)` - Logaritmo natural
- `LOG(x)` - Logaritmo base 10
- `LOG(b, x)` - Logaritmo base b

### Números aleatorios
- `RANDOM()` - Número aleatorio entre 0 y 1
- `SETSEED(seed)` - Establece semilla para números aleatorios

## Funciones de Agregación

### Básicas
- `COUNT(*)` - Cuenta filas
- `COUNT(expression)` - Cuenta valores no nulos
- `SUM(expression)` - Suma valores
- `AVG(expression)` - Promedio
- `MIN(expression)` - Valor mínimo
- `MAX(expression)` - Valor máximo

### Estadísticas
- `STDDEV(expression)` - Desviación estándar
- `VARIANCE(expression)` - Varianza
- `CORR(y, x)` - Coeficiente de correlación
- `REGR_SLOPE(y, x)` - Pendiente de regresión lineal

### Avanzadas
- `ARRAY_AGG(expression)` - Agrupa valores en array
- `JSON_AGG(expression)` - Agrupa valores en JSON
- `JSONB_AGG(expression)` - Agrupa valores en JSONB

## Funciones de Arrays

- `ARRAY[value1, value2, ...]` - Crea array
- `ARRAY_LENGTH(array, dimension)` - Longitud del array
- `ARRAY_UPPER(array, dimension)` - Índice superior
- `ARRAY_LOWER(array, dimension)` - Índice inferior
- `ARRAY_APPEND(array, element)` - Añade elemento
- `ARRAY_PREPEND(element, array)` - Añade elemento al inicio
- `ARRAY_CAT(array1, array2)` - Concatena arrays
- `ARRAY_POSITION(array, element)` - Posición del elemento
- `ARRAY_REMOVE(array, element)` - Elimina elemento
- `ARRAY_REPLACE(array, old, new)` - Reemplaza elemento
- `UNNEST(array)` - Expande array a filas

## Funciones JSON/JSONB

### Creación y manipulación
- `JSON_BUILD_OBJECT(key1, val1, key2, val2, ...)` - Crea objeto JSON
- `JSON_BUILD_ARRAY(val1, val2, ...)` - Crea array JSON
- `JSON_OBJECT(keys, values)` - Crea objeto desde arrays
- `JSON_STRIP_NULLS(json)` - Elimina valores null

### Extracción de datos
- `JSON_EXTRACT_PATH(json, path_elem, ...)` - Extrae valor por ruta
- `JSON_EXTRACT_PATH_TEXT(json, path_elem, ...)` - Extrae como texto
- `JSON_EACH(json)` - Expande objeto JSON a filas clave-valor
- `JSON_EACH_TEXT(json)` - Expande como texto
- `JSON_ARRAY_ELEMENTS(json)` - Expande array JSON a filas

### Operadores JSONB
- `->` - Obtiene valor JSON
- `->>` - Obtiene valor como texto
- `#>` - Obtiene valor por ruta como JSON
- `#>>` - Obtiene valor por ruta como texto
- `@>` - Contiene
- `<@` - Está contenido en
- `?` - Existe clave
- `?|` - Existe alguna clave
- `?&` - Existen todas las claves

## Funciones de Conversión y Casting

- `CAST(expression AS type)` - Conversión explícita
- `expression::type` - Conversión con operador
- `TO_NUMBER(text, format)` - Convierte texto a número
- `TO_CHAR(number, format)` - Convierte número a texto
- `COALESCE(val1, val2, ...)` - Primer valor no nulo
- `NULLIF(val1, val2)` - NULL si valores son iguales

## Funciones Condicionales

- `CASE WHEN condition THEN result [ELSE result] END` - Condicional
- `GREATEST(val1, val2, ...)` - Valor mayor
- `LEAST(val1, val2, ...)` - Valor menor

## Funciones de Ventana (Window Functions)

- `ROW_NUMBER()` - Número de fila
- `RANK()` - Ranking con empates
- `DENSE_RANK()` - Ranking denso
- `NTILE(n)` - Divide en n grupos
- `LAG(column, offset)` - Valor de fila anterior
- `LEAD(column, offset)` - Valor de fila siguiente
- `FIRST_VALUE(column)` - Primer valor en ventana
- `LAST_VALUE(column)` - Último valor en ventana

## Funciones del Sistema e Información

- `VERSION()` - Versión de PostgreSQL
- `CURRENT_DATABASE()` - Base de datos actual
- `CURRENT_SCHEMA()` - Schema actual
- `CURRENT_USER` - Usuario actual
- `SESSION_USER` - Usuario de sesión
- `INET_CLIENT_ADDR()` - Dirección IP del cliente
- `INET_SERVER_ADDR()` - Dirección IP del servidor
- `PG_BACKEND_PID()` - ID del proceso backend

## Funciones Criptográficas

- `MD5(string)` - Hash MD5
- `SHA1(string)` - Hash SHA1
- `SHA224(string)` - Hash SHA224
- `SHA256(string)` - Hash SHA256
- `SHA384(string)` - Hash SHA384
- `SHA512(string)` - Hash SHA512
- `CRYPT(password, salt)` - Encriptación con sal
- `GEN_SALT(type)` - Genera sal para encriptación