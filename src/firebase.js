import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyATq6STS624sqRxbuIaBqXFoa9P2zVuBV8",
  authDomain: "portfolio-2235e.firebaseapp.com",
  projectId: "portfolio-2235e",
  storageBucket: "portfolio-2235e.appspot.com",
  messagingSenderId: "604189080344",
  appId: "1:604189080344:web:15a51577791ec91126bc6d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);