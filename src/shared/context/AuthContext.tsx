import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore, deleteDoc } from 'firebase/firestore';
import { auth } from '../../firebase';
import { UserData, UserRole } from '../types/user';
import { userService } from '../../firebase/services/userService';
import { storage } from '../../firebase';
import { ref, deleteObject, listAll } from 'firebase/storage';

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  isOffline: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  currentUser: null, 
  userData: null,
  loading: true,
  isAdmin: false,
  isOffline: !navigator.onLine
});

export const useAuth = () => useContext(AuthContext);

const db = getFirestore();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsOffline(false);
      userService.goOnline();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setIsOffline(true);
      userService.goOffline();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        if (user) {
          let userDoc = await userService.getUserData(user.uid);
          
          if (!userDoc) {
            if (!isOnline) {
              throw new Error('Cannot create new user while offline');
            }
            userDoc = await userService.createUserData(user.uid, user.email || '');
          } else {
            // Cache user data for offline access
            localStorage.setItem(`userData_${user.uid}`, JSON.stringify(userDoc));
            if (isOnline) {
              await userService.updateLastLogin(user.uid);
            }
          }
          
          setUserData(userDoc);
        } else {
          setUserData(null);
          localStorage.removeItem('userData');
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isOnline]);

  if (error) {
    console.error('Authentication error:', error);
  }

  const isAdmin = userData?.role === 'admin';

  const signup = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create user document with role and profile photo
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        role: 'user',
        profilePhoto: '',
        createdAt: new Date().toISOString()
      });
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!currentUser) return;
    
    try {
      // First, delete all profile images
      const profileImagesRef = ref(storage, `profileImages/${currentUser.uid}`);
      const profileImages = await listAll(profileImagesRef);
      
      // Delete each profile image
      await Promise.all(
        profileImages.items.map((itemRef) => 
          deleteObject(itemRef).catch((error) => {
            console.warn("Error deleting profile image:", error);
            // Continue with deletion even if image deletion fails
          })
        )
      );

      // Delete the user's document from Firestore
      await deleteDoc(doc(db, "users", currentUser.uid));

      // Finally delete the user account
      await deleteUser(currentUser);
      
    } catch (error) {
      console.error("Error during account deletion:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      userData, 
      loading, 
      isAdmin,
      isOffline 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};