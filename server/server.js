const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const { verifyToken } = require('./middleware/auth');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Set up WebSocket server for real-time communication
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', verifyToken, messageRoutes);

// WebSocket connection handling
const clients = new Map();

wss.on('connection', (ws, req) => {
  const userId = req.url.split('=')[1];
  if (userId) {
    clients.set(userId, ws);
  }
  
  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    
    // Handle different types of messages
    switch (data.type) {
      case 'message':
        // Store message in database
        // Forward to recipient if online
        if (clients.has(data.to)) {
          clients.get(data.to).send(JSON.stringify({
            type: 'new_message',
            message: data.message,
            from: data.from,
            timestamp: new Date().toISOString(),
            encryptedContent: data.encryptedContent
          }));
        }
        break;
      // Other message types (typing indicators, read receipts, etc.)
    }
  });
  
  ws.on('close', () => {
    // Remove client when they disconnect
    clients.forEach((value, key) => {
      if (value === ws) {
        clients.delete(key);
      }
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 