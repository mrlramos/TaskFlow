const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize connection
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Load models
const Task = require('./task.model')(sequelize);
const AuditLog = require('./audit-log.model')(sequelize);

// Initialize associations
const models = { Task, AuditLog };

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export database instance with models
module.exports = {
  sequelize,
  Task,
  AuditLog
};