import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Community from './pages/Community';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute'; // Import the PublicRoute component
import { AuthProvider } from './context/AuthContext';
import React from 'react';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
