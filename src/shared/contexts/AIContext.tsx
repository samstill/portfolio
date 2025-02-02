import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust import as needed

export interface AIModel {
  id: string;
  name: string;
  provider: 'deepseek' | 'google';
  model: string;
}

export const AI_MODELS: AIModel[] = [
  { id: 'deepseek-chat', name: 'Deepseek Chat', provider: 'deepseek', model: 'deepseek-chat' },
  { id: 'gemini-pro', name: 'Google Gemini Pro', provider: 'google', model: 'gemini-pro' },
];

interface AIContextType {
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
  isModelDropdownOpen: boolean;
  setIsModelDropdownOpen: (open: boolean) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedModel, setSelectedModelState] = useState<AIModel>(AI_MODELS[0]);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  // Load stored model from Firestore on mount
  useEffect(() => {
    async function loadModel() {
      const docRef = doc(db, 'settings', 'ai');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().selectedModel) {
        setSelectedModelState(docSnap.data().selectedModel);
      }
    }
    loadModel();
  }, []);

  const setSelectedModel = async (model: AIModel) => {
    setSelectedModelState(model);
    const docRef = doc(db, 'settings', 'ai');
    await setDoc(docRef, { selectedModel: model }, { merge: true });
  };

  return (
    <AIContext.Provider value={{
      selectedModel,
      setSelectedModel,
      isModelDropdownOpen,
      setIsModelDropdownOpen
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
