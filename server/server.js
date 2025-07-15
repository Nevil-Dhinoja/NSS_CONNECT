const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const db = require('./db');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const reportsDir = path.join(uploadsDir, 'reports');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

const authRoutes = require('./routes/auth.js');
app.use('/api/auth', authRoutes);
const volunteerRoutes = require('./routes/volunteers.js');
app.use('/api/volunteers', volunteerRoutes); 
const workingHoursRoutes = require('./routes/workingHours.js');
app.use('/api/working-hours', workingHoursRoutes);
const eventsRoutes = require('./routes/events.js');
app.use('/api/events', eventsRoutes);

db.connect((err) => {
  if (err) {
    // Database connection error
    return;
  }
  // Database connected successfully
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);
  console.error('Request body:', req.body);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, '../client')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // Server started successfully
  console.log(`🚀 Here We Go Again ${PORT}`);
});
