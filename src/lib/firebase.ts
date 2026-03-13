import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration for JN Medical Suppliers
const firebaseConfig = {
  apiKey: "AIzaSyBB7f5nUzoZqZgW3Bf9rkg7CTqd8R0kczQ",
  authDomain: "jn-medical-3f664.firebaseapp.com",
  projectId: "jn-medical-3f664",
  storageBucket: "jn-medical-3f664.firebasestorage.app",
  messagingSenderId: "444704639973",
  appId: "1:444704639973:web:566b8fc92bfcc0a6ebbd0c",
  measurementId: "G-86Z0FKNEKF"
};

// Singleton instances
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Check if running in browser
const isBrowser = typeof window !== 'undefined';

// Get or initialize Firebase App
function getFirebaseApp(): FirebaseApp {
  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  }
  return app;
}

// Get or initialize Firebase Auth
export function getFirebaseAuth(): Auth {
  if (!auth && isBrowser) {
    const firebaseApp = getFirebaseApp();
    auth = getAuth(firebaseApp);
    // Set persistence to local (persists across browser sessions)
    setPersistence(auth, browserLocalPersistence).catch(console.error);
  }
  return auth!;
}

// Get or initialize Firestore
export function getFirebaseDb(): Firestore {
  if (!db) {
    const firebaseApp = getFirebaseApp();
    db = getFirestore(firebaseApp);
  }
  return db;
}

// Export for backward compatibility
export { app, auth, db };
export default getFirebaseApp;

// Initialize on client side
if (isBrowser) {
  getFirebaseApp();
  getFirebaseAuth();
  getFirebaseDb();
}
