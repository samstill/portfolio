import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Import the CSS file

function NotFound() {
  return (
    <div className="container">
      <h1 className="title">404 - Not Found</h1>
      <p className="subtitle">The page you are looking for does not exist.</p>
      <Link to="/" className="styled-link">Go to Home</Link>
    </div>
  );
}

export default NotFound;
