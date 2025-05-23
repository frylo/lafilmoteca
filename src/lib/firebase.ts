import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistence cache settings
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Log successful initialization
console.log('Firestore initialized with persistence cache');

const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, auth, storage, analytics };