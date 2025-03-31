import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';
// We're not using these components directly anymore
// import MessengerLayout from '../layouts/MessengerLayout';
// import Chat from '../components/Chat';
// import UserSearch from '../components/UserSearch';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Authentication routes */}
      <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/" />} />
      
      {/* Redirect messenger routes to the main app's routing system */}
      <Route path="/messenger/*" element={
        <ProtectedRoute>
          <Navigate to="/messenger" replace />
        </ProtectedRoute>
      } />
      
      {/* Other routes in your application */}
      {/* ... */}
    </Routes>
  );
};

export default AppRoutes; 