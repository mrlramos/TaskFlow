const rabbitmq = require('../config/rabbitmq');

class AuditService {
  constructor() {
    this.queueName = 'task-audit-queue';
    this.exchangeName = 'task-events';
  }

  async initialize() {
    try {
      const channel = rabbitmq.getChannel();
      
      // Declare exchange
      await channel.assertExchange(this.exchangeName, 'topic', { durable: true });
      
      // Declare queue
      await channel.assertQueue(this.queueName, { durable: true });
      
      // Bind queue to exchange
      await channel.bindQueue(this.queueName, this.exchangeName, 'task.*');
      
      console.log('🔍 Audit service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize audit service:', error);
      throw error;
    }
  }

  async publishTaskEvent(action, taskData, oldData = null) {
    try {
      const channel = rabbitmq.getChannel();
      
      const event = {
        action: action.toUpperCase(), // CREATE, UPDATE, DELETE
        taskId: taskData.id,
        newData: taskData,
        oldData: oldData,
        timestamp: new Date().toISOString(),
        userId: null // Future feature
      };

      const routingKey = `task.${action.toLowerCase()}`;
      const messageBuffer = Buffer.from(JSON.stringify(event));

      const published = channel.publish(
        this.exchangeName,
        routingKey,
        messageBuffer,
        { persistent: true }
      );

      if (published) {
        console.log(`📢 Published audit event: ${action} for task ${taskData.id}`);
      } else {
        console.warn(`⚠️ Failed to publish audit event: ${action} for task ${taskData.id}`);
      }

      return published;
    } catch (error) {
      console.error('❌ Error publishing audit event:', error);
      // Don't throw - audit failures shouldn't break the main operation
      return false;
    }
  }

  // Convenience methods
  async publishTaskCreated(taskData) {
    return this.publishTaskEvent('CREATE', taskData);
  }

  async publishTaskUpdated(newTaskData, oldTaskData) {
    return this.publishTaskEvent('UPDATE', newTaskData, oldTaskData);
  }

  async publishTaskDeleted(taskData) {
    return this.publishTaskEvent('DELETE', taskData);
  }
}

module.exports = new AuditService(); 