// Firebase configuration for lafilmoteca
// TODO: Add proper error handling for Firebase operations

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjnCkVNEfMlU8Up715DBFdM91JpiLsaLo",
  authDomain: "lafilmoteca-8384f.firebaseapp.com",
  projectId: "lafilmoteca-8384f",
  storageBucket: "lafilmoteca-8384f.firebasestorage.app",
  messagingSenderId: "622723111835",
  appId: "1:622723111835:web:c1945cd3505f8311f9df3e",
  measurementId: "G-VJJLDJ2YSX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, auth, storage, analytics };