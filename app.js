require('dotenv').config();
const express = require('express');
const taskRoutes = require('./src/routes/task.routes');
const auditRoutes = require('./src/routes/audit.routes');
const db = require('./src/models');
const rabbitmq = require('./src/config/rabbitmq');
const auditService = require('./src/services/audit.service');
const auditWorker = require('./src/services/audit-worker.service');

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
app.use('/audit', auditRoutes);

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync database (force recreate for clean start)
    await db.sequelize.sync({ force: true });
    console.log('✅ Database synchronized');
    
    // Initialize RabbitMQ connection
    try {
      await rabbitmq.connect();
      await auditService.initialize();
      await auditWorker.startConsumer();
      console.log('✅ RabbitMQ audit system initialized');
    } catch (rabbitmqError) {
      console.warn('⚠️ RabbitMQ not available - audit system disabled');
      console.warn('To enable audit logging, make sure RabbitMQ is running on localhost:5672');
    }
    
    // Add sample data
    await db.Task.bulkCreate([
      {
        title: 'Study Node.js',
        description: 'Learn basic Node.js concepts',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-12-30'
      },
      {
        title: 'Setup PostgreSQL',
        description: 'Install and configure PostgreSQL database',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-12-25'
      }
    ]);
    console.log('✅ Sample data inserted');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 TaskFlow API running at http://localhost:${PORT}`);
      console.log(`✅ Visit http://localhost:${PORT} to test`);
      console.log(`📊 Audit logs available at http://localhost:${PORT}/audit`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    console.error('Make sure PostgreSQL is running and database "taskflow" exists');
    process.exit(1);
  }
};

startServer();

module.exports = app;