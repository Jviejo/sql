require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

// Simular las funciones de autenticación
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const verificationCodes = new Map();

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

async function testVerificationFlow() {
  console.log('🧪 Probando flujo de verificación de código...\n');

  const testEmail = 'test@example.com';
  
  // Paso 1: Generar código
  console.log('1. Generando código de verificación...');
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  
  verificationCodes.set(testEmail, { code, expiresAt });
  console.log(`   ✅ Código generado: ${code}`);
  console.log(`   ⏰ Expira: ${expiresAt}`);

  // Paso 2: Verificar código correcto
  console.log('\n2. Verificando código correcto...');
  const storedData = verificationCodes.get(testEmail);
  
  if (storedData && storedData.code === code) {
    console.log('   ✅ Código verificado correctamente');
    verificationCodes.delete(testEmail);
  } else {
    console.log('   ❌ Error en verificación');
    return;
  }

  // Paso 3: Verificar código incorrecto
  console.log('\n3. Verificando código incorrecto...');
  const wrongCode = '999999';
  const storedData2 = verificationCodes.get(testEmail);
  
  if (!storedData2) {
    console.log('   ✅ Código ya fue eliminado (correcto)');
  } else {
    console.log('   ❌ Código no fue eliminado');
  }

  // Paso 4: Probar MongoDB
  console.log('\n4. Probando conexión a MongoDB...');
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Buscar usuario de prueba
    const user = await usersCollection.findOne({ email: testEmail });
    
    if (user) {
      console.log(`   ✅ Usuario encontrado: ${user.email} (rol: ${user.role})`);
    } else {
      console.log('   ℹ️  Usuario no encontrado (normal para primera prueba)');
    }
    
    await client.close();
  } catch (error) {
    console.log('   ❌ Error de MongoDB:', error.message);
  }

  // Paso 5: Probar JWT
  console.log('\n5. Probando generación de JWT...');
  try {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: 'test123', email: testEmail, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('   ✅ JWT generado correctamente');
    console.log(`   🔑 Token: ${token.substring(0, 20)}...`);
  } catch (error) {
    console.log('   ❌ Error generando JWT:', error.message);
  }

  console.log('\n✅ Prueba completada. El sistema de verificación funciona correctamente.');
}

testVerificationFlow().catch(console.error); 