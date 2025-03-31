const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  profilePicture: {
    type: String,
    default: ''
  },
  publicKey: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 