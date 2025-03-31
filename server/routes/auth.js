const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegistration, validateLogin } = require('../utils/validators');

// Register route
router.post('/register', async (req, res) => {
  try {
    // Validate registration data
    const { error } = validateRegistration(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate key pair for E2E encryption
    const { publicKey, privateKey } = require('../utils/crypto').generateKeyPair();
    
    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      publicKey
    });
    
    // Save user to database
    const savedUser = await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user data and token
    res.status(201).json({
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      token,
      publicKey,
      privateKey // Send to client but never store on server
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    // Validate login data
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    
    const { identifier, password } = req.body;
    
    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user data and token
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
      publicKey: user.publicKey
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 