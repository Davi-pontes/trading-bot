import { createClient, RedisClientType } from "redis";

export abstract class RedisClientProvider {
  private static client: RedisClientType | null = null;

  static async connect(url: string): Promise<RedisClientType> {
    if (this.client && this.client.isOpen) {
      return this.client;
    }
    try {
      this.client = createClient({ url: url });

      this.client.on("error", (err) => {
        console.error("Redis Client Error:", err);
      });

      await this.client.connect();
      console.log("✅ Redis connected");

      return this.client;
    } catch (error: any) {
      throw error;
    }
  }

  static getClient(): RedisClientType {
    if (!this.client || !this.client.isOpen) {
      throw new Error("Redis client is not connected. Call connect() first.");
    }
    return this.client;
  }
}
