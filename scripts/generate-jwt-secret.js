const crypto = require('crypto');

// Generar un JWT secret seguro de 64 caracteres
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('JWT_SECRET generado:');
console.log(jwtSecret);
console.log('\nAgrega esta línea a tu archivo .env.local:');
console.log(`JWT_SECRET=${jwtSecret}`); 