import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ProfileContextType {
  profileImage: string;
  setProfileImage: (url: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileImage, setProfileImage] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (currentUser?.uid) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().profilePhoto) {
          setProfileImage(userDoc.data().profilePhoto);
        }
      }
    };

    loadUserProfile();
  }, [currentUser]);

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
