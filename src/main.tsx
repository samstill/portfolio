declare global {
  interface ImportMetaEnv {
    MODE: string
    VITE_NODE_ENV: string
  }
}


import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseProvider } from './context/FirebaseContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <FirebaseProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </FirebaseProvider>
  </React.StrictMode>
);
