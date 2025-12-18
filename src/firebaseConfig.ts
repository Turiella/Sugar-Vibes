import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, Firestore } from "firebase/firestore";

// TODO: Reemplaza este objeto con la configuración de tu propio proyecto de Firebase
// que encontrarás en la consola de Firebase > Configuración del proyecto.
const firebaseConfig = {
  apiKey: "AIzaSyBVyZLnfNMa5kQ_uLLbZjDaiW276J9u0gQ",
  authDomain: "sugar-vibes.firebaseapp.com",
  projectId: "sugar-vibes",
  storageBucket: "sugar-vibes.firebasestorage.app",
  messagingSenderId: "1050505896406",
  appId: "1:1050505896406:web:cdbe1dba131e9a25b2c477",
  measurementId: "G-1KN6W5RTWT"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Habilita la persistencia offline para una mejor experiencia de usuario
let db: Firestore;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({})
  });
  console.log("Firestore offline persistence successfully enabled.");
} catch (err: any) {
  if (err.code == 'failed-precondition') {
    console.warn("Firestore offline persistence failed: Multiple tabs open.");
  } else if (err.code == 'unimplemented') {
    console.warn("Firestore offline persistence failed: Browser does not support it.");
  }
  // Fallback to in-memory persistence
  db = getFirestore(app);
}


// Exporta la instancia de la base de datos de Firestore
export { db };