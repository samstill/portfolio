import React, { createContext, useContext, useEffect, useState } from 'react';
import app from '../firebase'; // Import the initialized app
import { Auth, getAuth } from 'firebase/auth';

interface FirebaseContextType {
  isInitialized: boolean;
  auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseContextType>({ 
  isInitialized: false, 
  auth: null 
});

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    try {
      const authInstance = getAuth(app);
      setAuth(authInstance);
      setIsInitialized(true);
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }, []);

  if (!isInitialized || !auth) {
    return <div>Loading...</div>;
  }

  return (
    <FirebaseContext.Provider value={{ isInitialized, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
