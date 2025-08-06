require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

async function testConfiguration() {
  console.log('🧪 Probando configuración del sistema de autenticación...\n');

  // Test 1: Variables de entorno
  console.log('1. Verificando variables de entorno...');
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'NODE_ENV'];
  let envOk = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName}: ${varName === 'JWT_SECRET' ? '***' : process.env[varName]}`);
    } else {
      console.log(`   ❌ ${varName}: NO CONFIGURADO`);
      envOk = false;
    }
  });

  if (!envOk) {
    console.log('\n❌ Faltan variables de entorno. Agrega las variables faltantes a tu .env.local');
    return;
  }

  // Test 2: MongoDB connection
  console.log('\n2. Probando conexión a MongoDB...');
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    await db.admin().ping();
    console.log('   ✅ Conexión a MongoDB exitosa');
    console.log(`   📊 Base de datos: ${db.databaseName}`);
    await client.close();
  } catch (error) {
    console.log('   ❌ Error de conexión a MongoDB:', error.message);
    return;
  }

  // Test 3: Email configuration
  console.log('\n3. Probando configuración de email...');
  try {
    const transporter = nodemailer.createTransporter({
      host: 'localhost',
      port: 1025,
      secure: false,
    });

    await transporter.verify();
    console.log('   ✅ Configuración de email exitosa (MailHog)');
  } catch (error) {
    console.log('   ❌ Error de configuración de email:', error.message);
    console.log('   💡 Asegúrate de que MailHog esté ejecutándose: brew services start mailhog');
    return;
  }

  // Test 4: Send test email
  console.log('\n4. Probando envío de email...');
  try {
    const transporter = nodemailer.createTransporter({
      host: 'localhost',
      port: 1025,
      secure: false,
    });

    const testCode = '123456';
    const mailOptions = {
      from: 'test@example.com',
      to: 'test@example.com',
      subject: 'Test de verificación',
      html: `<h1>Código de prueba: ${testCode}</h1>`
    };

    await transporter.sendMail(mailOptions);
    console.log('   ✅ Email de prueba enviado exitosamente');
    console.log('   📧 Revisa MailHog en: http://localhost:8025');
  } catch (error) {
    console.log('   ❌ Error al enviar email de prueba:', error.message);
  }

  console.log('\n✅ Configuración completada. El sistema debería funcionar correctamente.');
  console.log('\n🚀 Para iniciar el servidor: npm run dev');
  console.log('👤 Para crear usuario admin: npm run create-admin');
}

testConfiguration().catch(console.error); 