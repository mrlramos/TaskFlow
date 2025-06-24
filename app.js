require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const taskRoutes = require('./src/routes/task.routes');
const db = require('./src/database/connection');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Database initialization and server start
const startServer = async () => {
  try {
    // Test database connection (this will create the database if it doesn't exist)
    try {
      await db.query('SELECT 1');
      console.log('✅ Database connected successfully');
    } catch (err) {
      if (err.code === '3D000') { // Database does not exist
        console.log('📝 Database does not exist, please create it manually:');
        console.log('   psql -U postgres');
        console.log('   CREATE DATABASE taskflow;');
        throw new Error('Database "taskflow" does not exist');
      }
      throw err;
    }
    
    // Initialize database (create tables)
    const initSQL = fs.readFileSync(path.join(__dirname, 'src/database/init.sql'), 'utf8');
    await db.query(initSQL);
    console.log('✅ Database initialized');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 TaskFlow API running at http://localhost:${PORT}`);
      console.log(`✅ Visit http://localhost:${PORT} to test`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;