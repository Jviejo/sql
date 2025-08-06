/**
 * Script para exportar cuestionarios y preguntas de la base de datos local
 * e importar en la remota. Borra las colecciones de la base de datos remota antes de importar.
 * 
 * Uso: node sync-cuestionarios.js
 * 
 * Requiere: npm install mongodb
 */

const { MongoClient } = require('mongodb');

const LOCAL_URI = 'mongodb://localhost:27017';
const REMOTE_URI = 'mongodb+srv://jviejo2025:damehueco2025@cluster0.bqfvg.mongodb.net?retryWrites=tru ';
const DB_NAME = 'formacion';
const COLLECTIONS = ['cuestionarios', 'preguntas'];

async function exportAndImport() {
  const localClient = new MongoClient(LOCAL_URI);
  const remoteClient = new MongoClient(REMOTE_URI);

  try {
    // Conectar a ambas bases de datos
    await localClient.connect();
    await remoteClient.connect();

    const localDb = localClient.db(DB_NAME);
    const remoteDb = remoteClient.db(DB_NAME);

    for (const collectionName of COLLECTIONS) {
      // Exportar datos de la colección local
      const localCollection = localDb.collection(collectionName);
      const docs = await localCollection.find({}).toArray();

      // Borrar la colección remota
      const remoteCollection = remoteDb.collection(collectionName);
      await remoteCollection.deleteMany({});

      // Importar los documentos a la colección remota (si hay)
      if (docs.length > 0) {
        await remoteCollection.insertMany(docs);
        console.log(`Colección '${collectionName}' sincronizada (${docs.length} documentos).`);
      } else {
        console.log(`Colección '${collectionName}' está vacía en local, solo se borró en remoto.`);
      }
    }

    console.log('Sincronización completada.');
  } catch (err) {
    console.error('Error durante la sincronización:', err);
  } finally {
    await localClient.close();
    await remoteClient.close();
  }
}

exportAndImport();
