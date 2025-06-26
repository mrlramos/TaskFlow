const rabbitmq = require('../config/rabbitmq');
const { AuditLog } = require('../models');

class AuditWorkerService {
  constructor() {
    this.queueName = 'task-audit-queue';
    this.isRunning = false;
  }

  async startConsumer() {
    try {
      if (this.isRunning) {
        console.log('🔄 Audit worker is already running');
        return;
      }

      const channel = rabbitmq.getChannel();
      
      // Ensure queue exists
      await channel.assertQueue(this.queueName, { durable: true });
      
      // Set prefetch to process one message at a time
      await channel.prefetch(1);

      console.log('🎯 Audit worker started, waiting for messages...');
      this.isRunning = true;

      // Start consuming messages
      await channel.consume(this.queueName, async (message) => {
        if (message) {
          try {
            const eventData = JSON.parse(message.content.toString());
            console.log(`📝 Processing audit event: ${eventData.action} for task ${eventData.taskId}`);
            
            await this.processAuditEvent(eventData);
            
            // Acknowledge message
            channel.ack(message);
            console.log(`✅ Audit event processed successfully`);
            
          } catch (error) {
            console.error('❌ Error processing audit message:', error);
            
            // Reject message and requeue
            channel.nack(message, false, true);
          }
        }
      });

    } catch (error) {
      console.error('❌ Failed to start audit worker:', error);
      this.isRunning = false;
      throw error;
    }
  }

  async processAuditEvent(eventData) {
    try {
      const { action, taskId, newData, oldData, timestamp, userId } = eventData;

      // Create audit log entry
      await AuditLog.create({
        taskId: taskId,
        action: action,
        newData: newData,
        oldData: oldData,
        userId: userId,
        timestamp: new Date(timestamp)
      });

      console.log(`📊 Audit log saved: ${action} for task ${taskId}`);
      
    } catch (error) {
      console.error('❌ Error saving audit log:', error);
      throw error;
    }
  }

  async stopConsumer() {
    try {
      this.isRunning = false;
      console.log('🛑 Audit worker stopped');
    } catch (error) {
      console.error('❌ Error stopping audit worker:', error);
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      queueName: this.queueName
    };
  }
}

module.exports = new AuditWorkerService(); 