
import { MongoClient } from 'mongodb';

const LOCAL_URI = 'mongodb://localhost:27017';
const REMOTE_URI = 'mongodb+srv://usuario:contraseña@cluster0.bqfvg.mongodb.net?retryWrites=true&w=majority';
const DB_NAME = 'formacion';
const COLLECTIONS: string[] = ['cuestionarios', 'preguntas'];

async function exportAndImport(): Promise<void> {
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
