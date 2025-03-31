const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify user token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user and check if they exist
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Set user ID for route handlers
    req.userId = user._id;
    req.isAdmin = user.isAdmin || false;
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
  // First verify the token
  verifyToken(req, res, () => {
    // Then check if user is admin
    if (req.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
    }
  });
};

module.exports = { verifyToken, adminOnly }; 