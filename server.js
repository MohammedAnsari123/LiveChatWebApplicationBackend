const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// Allowed origins for CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://live-chat-web-application-frontend-jf27tw4dl.vercel.app/'
    ];

// Socket.io setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Store online users
const onlineUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User comes online
  socket.on('user-online', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('user-status-change', {
      userId,
      status: 'online'
    });
    console.log(`User ${userId} is online`);
  });

  // Handle sending messages
  socket.on('send-message', (message) => {
    const receiverSocketId = onlineUsers.get(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive-message', message);
    }
  });

  // Handle typing indicator
  socket.on('typing', ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user-typing', senderId);
    }
  });

  // Handle stop typing
  socket.on('stop-typing', ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user-stop-typing', senderId);
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    let disconnectedUserId = null;
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    if (disconnectedUserId) {
      io.emit('user-status-change', {
        userId: disconnectedUserId,
        status: 'offline'
      });
      console.log(`User ${disconnectedUserId} went offline`);
    }
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);
app.set('onlineUsers', onlineUsers);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Live Chat API is running' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
