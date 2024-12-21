import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8">Welcome to Our Portfolio</h1>
        <p className="text-lg mb-8">Explore our projects and join the community.</p>
        <Link to="/login">
          <button className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-300">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
