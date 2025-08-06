const fetch = require('node-fetch');

async function testFrontendFlow() {
  console.log('🧪 Probando flujo completo desde frontend...\n');

  const baseUrl = 'http://localhost:3000';
  const testEmail = 'test@example.com';

  try {
    // Paso 1: Login (enviar email)
    console.log('1. Enviando solicitud de login...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });

    const loginData = await loginResponse.json();
    console.log('   Respuesta login:', loginData);

    if (!loginData.success) {
      console.log('   ❌ Error en login');
      return;
    }

    // Paso 2: Verificar códigos almacenados
    console.log('\n2. Verificando códigos almacenados...');
    const codesResponse = await fetch(`${baseUrl}/api/debug/codes`);
    const codesData = await codesResponse.json();
    console.log('   Códigos almacenados:', codesData);

    // Paso 3: Obtener código del servidor (en desarrollo)
    const storedCodes = codesData.codes;
    const userCode = storedCodes[testEmail];
    
    if (!userCode) {
      console.log('   ❌ No se encontró código para el usuario');
      return;
    }

    console.log(`   ✅ Código encontrado: ${userCode.code}`);

    // Paso 4: Verificar código
    console.log('\n3. Verificando código...');
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

    const verifyData = await verifyResponse.json();
    console.log('   Respuesta verificación:', verifyData);

    if (verifyData.success) {
      console.log('   ✅ Verificación exitosa');
      console.log(`   👤 Usuario: ${verifyData.user.email}`);
      console.log(`   🔑 Token: ${verifyData.token.substring(0, 20)}...`);
    } else {
      console.log('   ❌ Error en verificación');
    }

  } catch (error) {
    console.error('Error en prueba:', error.message);
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
    await testFrontendFlow();
  }
}

main(); 