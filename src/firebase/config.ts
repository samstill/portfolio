import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyCBWuWywOWSeWHZ6BAezjdw2TZX8Mu8bs4",
  authDomain: "portfolio-f1d36.firebaseapp.com",
  projectId: "portfolio-f1d36",
  storageBucket: "portfolio-f1d36.firebasestorage.app",
  messagingSenderId: "323867899229",
  appId: "1:323867899229:web:a2e16a9a63bf51eef5e4b4",
  measurementId: "G-Z8HTRENQRZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
