require('dotenv').config({ path: '.env.local' });

console.log('🔍 Variables de entorno actuales:');
console.log('');

const vars = [
  'MONGODB_URI',
  'JWT_SECRET', 
  'NODE_ENV',
  'POSTGRES_URL',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_FROM'
];

vars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName === 'JWT_SECRET' ? '***CONFIGURADO***' : value}`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADO`);
  }
});

console.log('');
console.log('📝 Para que funcione el sistema de autenticación, necesitas:');
console.log('   - JWT_SECRET (para tokens)');
console.log('   - NODE_ENV=development (para modo desarrollo)');
console.log('   - MONGODB_URI (para la base de datos)');

if (!process.env.JWT_SECRET) {
  console.log('');
  console.log('🔑 Para generar un JWT_SECRET, ejecuta:');
  console.log('   node scripts/generate-jwt-secret.js');
} 