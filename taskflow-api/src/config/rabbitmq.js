const amqp = require('amqplib');

class RabbitMQConnection {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  }

  async connect() {
    try {
      console.log('🐰 Connecting to RabbitMQ...');
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      
      // Setup error handlers
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
      });
      
      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed');
      });

      console.log('✅ RabbitMQ connected successfully');
      return this.channel;
    } catch (error) {
      console.error('❌ Failed to connect to RabbitMQ:', error.message);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('🐰 RabbitMQ disconnected');
    } catch (error) {
      console.error('Error disconnecting from RabbitMQ:', error);
    }
  }

  getChannel() {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized. Call connect() first.');
    }
    return this.channel;
  }
}

// Singleton instance
const rabbitmqConnection = new RabbitMQConnection();

module.exports = rabbitmqConnection; 