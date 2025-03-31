const router = require('express').Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const { adminOnly } = require('../middleware/auth');

// Get all conversations (admin only)
router.get('/conversations', adminOnly, async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate('participants', 'username email profilePicture');
    
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get messages by conversation (admin only)
router.get('/messages/:conversationId', adminOnly, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    })
    .populate('sender', 'username email')
    .sort({ createdAt: 1 });
    
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get specific user data (admin only)
router.get('/users/:userId', adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('username email publicKey profilePicture createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 