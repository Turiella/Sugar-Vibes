import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, Firestore } from "firebase/firestore";

// Las variables de entorno se cargan desde el archivo .env.local
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
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