const amqp = require('amqplib');

class RabbitMQConnection {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async connect() {
    try {
      console.log('🐰 Connecting to RabbitMQ...');
      
      // Add connection timeout to prevent hanging
      this.connection = await amqp.connect(this.url, {
        heartbeat: 60,
        connection_timeout: 5000, // 5 second timeout
      });
      
      this.channel = await this.connection.createChannel();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Setup error handlers
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        this.isConnected = false;
        this.handleConnectionError();
      });
      
      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed');
        this.isConnected = false;
        this.handleConnectionError();
      });

      console.log('✅ RabbitMQ connected successfully');
      return this.channel;
    } catch (error) {
      console.error('❌ Failed to connect to RabbitMQ:', error.message);
      this.isConnected = false;
      this.handleConnectionError();
      throw error;
    }
  }

  async handleConnectionError() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect to RabbitMQ (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect().catch(err => {
          console.error('❌ Reconnection failed:', err.message);
        });
      }, 5000 * this.reconnectAttempts); // Exponential backoff
    } else {
      console.error('❌ Max reconnection attempts reached. RabbitMQ will be unavailable.');
    }
  }

  async disconnect() {
    try {
      this.isConnected = false;
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
    if (!this.channel || !this.isConnected) {
      throw new Error('RabbitMQ channel not available. Connection may be down.');
    }
    return this.channel;
  }

  isHealthy() {
    return this.isConnected && this.channel;
  }
}

// Singleton instance
const rabbitmqConnection = new RabbitMQConnection();

module.exports = rabbitmqConnection; 