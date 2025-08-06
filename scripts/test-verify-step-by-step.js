const fetch = require('node-fetch');

async function testStepByStep() {
  console.log('🧪 Probando verificación paso a paso...\n');

  const baseUrl = 'http://localhost:3000';
  const testEmail = 'test@example.com';

  try {
    // Paso 1: Login
    console.log('1️⃣ Enviando solicitud de login...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });

    const loginData = await loginResponse.json();
    console.log('   📋 Respuesta login:', loginData);

    if (!loginData.success) {
      console.log('   ❌ Error en login');
      return;
    }

    // Paso 2: Verificar códigos almacenados
    console.log('\n2️⃣ Verificando códigos almacenados...');
    const codesResponse = await fetch(`${baseUrl}/api/debug/codes`);
    const codesData = await codesResponse.json();
    console.log('   📋 Códigos almacenados:', codesData);

    if (!codesData.success) {
      console.log('   ❌ Error obteniendo códigos');
      return;
    }

    const storedCodes = codesData.codes;
    const userCode = storedCodes[testEmail];
    
    if (!userCode) {
      console.log('   ❌ No se encontró código para el usuario');
      return;
    }

    console.log(`   ✅ Código encontrado: ${userCode.code}`);
    console.log(`   ⏰ Expira: ${userCode.expiresAt}`);

    // Paso 3: Verificar código correcto
    console.log('\n3️⃣ Verificando código correcto...');
    const verifyResponse = await fetch(`${baseUrl}/api/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: testEmail, 
        code: userCode.code 
      }),
    });

    console.log(`   📊 Status: ${verifyResponse.status}`);
    const verifyData = await verifyResponse.json();
    console.log('   📋 Respuesta verificación:', verifyData);

    if (verifyData.success) {
      console.log('   ✅ Verificación exitosa');
      console.log(`   👤 Usuario: ${verifyData.user.email}`);
      console.log(`   🔑 Token: ${verifyData.token.substring(0, 20)}...`);
    } else {
      console.log('   ❌ Error en verificación');
      console.log(`   💬 Mensaje: ${verifyData.message}`);
    }

    // Paso 4: Verificar códigos después de la verificación
    console.log('\n4️⃣ Verificando códigos después de la verificación...');
    const codesAfterResponse = await fetch(`${baseUrl}/api/debug/codes`);
    const codesAfterData = await codesAfterResponse.json();
    console.log('   📋 Códigos restantes:', codesAfterData);

  } catch (error) {
    console.error('❌ Error en prueba:', error.message);
  }
}

// Verificar si el servidor está ejecutándose
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    console.log('✅ Servidor ejecutándose en http://localhost:3000');
    return true;
  } catch (error) {
    console.log('❌ Servidor no está ejecutándose');
    console.log('💡 Ejecuta: npm run dev');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testStepByStep();
  }
}

main(); 