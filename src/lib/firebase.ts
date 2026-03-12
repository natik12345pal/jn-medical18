import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration for JN Medical Suppliers
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Check if Firebase config is valid
const isFirebaseConfigValid = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
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
    if (!isFirebaseConfigValid()) {
      console.error('Firebase configuration is missing or invalid. Please check your environment variables.');
      throw new Error('Firebase configuration is missing. Please set NEXT_PUBLIC_FIREBASE_* environment variables.');
    }
    
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
    try {
      const firebaseApp = getFirebaseApp();
      auth = getAuth(firebaseApp);
      // Set persistence to local (persists across browser sessions)
      setPersistence(auth, browserLocalPersistence).catch(console.error);
    } catch (error) {
      console.error('Failed to initialize Firebase Auth:', error);
      throw error;
    }
  }
  return auth!;
}

// Get or initialize Firestore
export function getFirebaseDb(): Firestore {
  if (!db) {
    try {
      const firebaseApp = getFirebaseApp();
      db = getFirestore(firebaseApp);
    } catch (error) {
      console.error('Failed to initialize Firestore:', error);
      throw error;
    }
  }
  return db;
}

// Check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  return isFirebaseConfigValid();
}

// Export for backward compatibility
export { app, auth, db };
export default getFirebaseApp;

// Initialize on client side
if (isBrowser && isFirebaseConfigValid()) {
  try {
    getFirebaseApp();
    getFirebaseAuth();
    getFirebaseDb();
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}
