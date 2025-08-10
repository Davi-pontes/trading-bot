import amqplib, { Channel, ChannelModel, Connection } from 'amqplib';

class RabbitMQ {
  private static connection: ChannelModel | null = null;
  private static channel: Channel | null = null;

  private static readonly RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

  public static async init(): Promise<void> {
    if (this.connection && this.channel) {
      return;
    }

    try {
      this.connection = await amqplib.connect(this.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();

      this.connection.on('error', (err) => {
        console.error('🐰 RabbitMQ connection error:', err);
        this.connection = null;
        this.channel = null;
      });

      this.connection.on('close', () => {
        console.warn('⚠️ RabbitMQ connection closed.');
        this.connection = null;
        this.channel = null;
      });

      console.log('✅ RabbitMQ connected and channel created.');
    } catch (error) {
      console.error('❌ Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  public static getChannel(): Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized. Call RabbitMQ.init() first.');
    }

    return this.channel;
  }

  public static async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('🛑 RabbitMQ connection closed.');
    } catch (error) {
      console.error('❌ Error closing RabbitMQ connection:', error);
    } finally {
      this.channel = null;
      this.connection = null;
    }
  }
}

export default RabbitMQ;
