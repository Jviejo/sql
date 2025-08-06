require('dotenv').config({ path: '.env.local' });

console.log('🔐 Verificando variables de autenticación...\n');

const requiredVars = {
  'JWT_SECRET': 'Secreto para firmar tokens JWT',
  'NODE_ENV': 'Entorno de desarrollo/producción',
  'MONGODB_URI': 'URI de conexión a MongoDB'
};

let allOk = true;

Object.entries(requiredVars).forEach(([varName, description]) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName === 'JWT_SECRET' ? '***CONFIGURADO***' : value}`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADO - ${description}`);
    allOk = false;
  }
});

console.log('');

if (allOk) {
  console.log('✅ Todas las variables requeridas están configuradas');
  console.log('🚀 El sistema de autenticación debería funcionar correctamente');
} else {
  console.log('❌ Faltan variables requeridas');
  console.log('');
  console.log('📝 Agrega estas variables a tu archivo .env.local:');
  console.log('');
  console.log('JWT_SECRET=3b0fe6416f8ef608da11e489cf7e1f1a717b39861c0359a2c7640fa75d08e27e');
  console.log('NODE_ENV=development');
  console.log('MONGODB_URI=mongodb://localhost:27017/sql_learning');
  console.log('');
  console.log('🔑 Para generar un nuevo JWT_SECRET:');
  console.log('   node scripts/generate-jwt-secret.js');
}

console.log('');
console.log('🧪 Para probar el sistema:');
console.log('   npm run test-step-by-step'); 