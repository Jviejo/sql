const { MongoClient } = require('mongodb');

async function createAdminUser() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sql_learning';
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Verificar si ya existe un usuario admin
    const existingAdmin = await usersCollection.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Ya existe un usuario admin:', existingAdmin.email);
      return;
    }
    
    // Crear usuario admin
    const adminUser = {
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await usersCollection.insertOne(adminUser);
    
    console.log('Usuario admin creado exitosamente:');
    console.log('Email:', adminUser.email);
    console.log('ID:', result.insertedId);
    console.log('\nPuedes cambiar el email editando directamente en MongoDB o usando la interfaz de administración.');
    
  } catch (error) {
    console.error('Error al crear usuario admin:', error);
  } finally {
    await client.close();
  }
}

createAdminUser(); 