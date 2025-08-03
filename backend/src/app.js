const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
const projectRoutes = require('./routes/projectRoutes');

dotenv.config();
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Initialize Prisma and Supabase
const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Make prisma, supabase, and io available globally
global.prisma = prisma;
global.supabase = supabase;
global.io = io;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/logs', logRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Authenticate socket connection
  socket.on('authenticate', async (data) => {
    try {
      const { token, projectId } = data;
      
      if (!token) {
        socket.emit('error', { message: 'Token required' });
        return;
      }

      // Verify token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        socket.emit('error', { message: 'Invalid token' });
        return;
      }

      // Verify project access
      if (projectId) {
        const project = await prisma.project.findFirst({
          where: {
            id: projectId,
            ownerId: user.id
          }
        });

        if (!project) {
          socket.emit('error', { message: 'Project access denied' });
          return;
        }
      }

      // Store user info in socket
      socket.userId = user.id;
      socket.projectId = projectId;
      
      // Join project room for real-time updates
      if (projectId) {
        socket.join(`project:${projectId}`);
      }

      socket.emit('authenticated', { 
        userId: user.id, 
        projectId: projectId 
      });

      console.log(`User ${user.id} authenticated for project ${projectId}`);
    } catch (error) {
      console.error('Socket authentication error:', error);
      socket.emit('error', { message: 'Authentication failed' });
    }
  });

  // Join project room
  socket.on('join-project', (projectId) => {
    if (socket.userId) {
      socket.join(`project:${projectId}`);
      socket.projectId = projectId;
      socket.emit('joined-project', { projectId });
    }
  });

  // Leave project room
  socket.on('leave-project', (projectId) => {
    socket.leave(`project:${projectId}`);
    socket.emit('left-project', { projectId });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const port = process.env.PORT || 8081;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`WebSocket server is ready`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});