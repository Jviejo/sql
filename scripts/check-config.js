const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración del sistema...\n');

// Verificar archivo .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ Archivo .env.local encontrado');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  console.log('\n📋 Variables de entorno configuradas:');
  envVars.forEach(line => {
    const [key] = line.split('=');
    console.log(`  - ${key}`);
  });
} else {
  console.log('❌ Archivo .env.local NO encontrado');
  console.log('\n📝 Crea un archivo .env.local con las siguientes variables:');
  console.log(`
MONGODB_URI=mongodb://localhost:27017/sql_learning
JWT_SECRET=3b0fe6416f8ef608da11e489cf7e1f1a717b39861c0359a2c7640fa75d08e27e
NODE_ENV=development
  `);
}

// Verificar MongoDB
console.log('\n🗄️  Verificando MongoDB...');
console.log('Para verificar MongoDB, ejecuta:');
console.log('  brew services list | grep mongodb');
console.log('  o');
console.log('  mongosh --eval "db.runCommand(\\"ping\\")"');

// Verificar MailHog
console.log('\n📧 Verificando MailHog...');
console.log('Para verificar MailHog, ejecuta:');
console.log('  brew services list | grep mailhog');
console.log('  o');
console.log('  curl http://localhost:8025');

console.log('\n🚀 Para iniciar el servidor:');
console.log('  npm run dev');

console.log('\n👤 Para crear un usuario admin:');
console.log('  npm run create-admin'); 