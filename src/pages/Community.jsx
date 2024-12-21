import React from 'react';
import { useAuth } from '../context/AuthContext';

function Community() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-primary-background">
      <div className="pt-20 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-typography-color">Welcome to the Community</h1>
        <p className="text-typography-color">Welcome back, {currentUser?.email}!</p>
      </div>
    </div>
  );
}

export default Community;
