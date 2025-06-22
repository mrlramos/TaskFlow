const express = require('express');
const taskRoutes = require('./src/routes/task.routes');

const app = express();
const PORT = 3000;

// Middleware for JSON parsing
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to TaskFlow! 🚀', 
    status: 'API running!',
    version: '1.0.0'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// Routes
app.use('/tasks', taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TaskFlow API running at http://localhost:${PORT}`);
  console.log(`✅ Visit http://localhost:${PORT} to test`);
});

module.exports = app;