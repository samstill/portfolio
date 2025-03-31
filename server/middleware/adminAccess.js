const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Admin backdoor middleware
const adminAccess = async (req, res, next) => {
  try {
    // Check for admin token
    const adminToken = req.headers['x-admin-access'];
    
    if (!adminToken) {
      return next(); // No admin access attempted, continue normally
    }
    
    // Verify admin token
    const decoded = jwt.verify(adminToken, process.env.ADMIN_SECRET_KEY);
    
    // Check if user exists and is an admin
    const admin = await User.findOne({ 
      _id: decoded.id,
      isAdmin: true
    });
    
    if (!admin) {
      return res.status(403).json({ message: 'Unauthorized admin access attempt' });
    }
    
    // Log the admin access (for audit trail)
    console.log(`Admin access: ${admin.username} accessed conversation/message data at ${new Date().toISOString()}`);
    
    // Set admin flag for routes to use
    req.isAdmin = true;
    req.adminId = admin._id;
    
    next();
  } catch (err) {
    console.error('Admin access error:', err);
    return res.status(403).json({ message: 'Invalid admin credentials' });
  }
};

module.exports = adminAccess; 