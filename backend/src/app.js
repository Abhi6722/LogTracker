const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
const { rateLimiter } = require('./middleware/authMiddleware');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes)

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})