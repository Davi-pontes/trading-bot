// redis.repository.ts
import { RedisClientType } from 'redis';

export class RedisRepository {
  constructor(private client: RedisClientType) {}

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
  async scanKeys(pattern: string): Promise<string[]> {
    let cursor = '0';
    const keys: string[] = [];

    do {
      const result = await this.client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = result.cursor;
      keys.push(...result.keys);
    } while (cursor !== '0');

    return keys;
  }

  async mGet(keys: string[]): Promise<(string | null)[]> {
    if (keys.length === 0) return [];
    return await this.client.mGet(keys);
  }
  async saveMany(entries: { key: string; value: string }[]): Promise<void> {
    if (!entries.length) return;

    const multi = this.client.multi();
    for (const { key, value } of entries) {
      multi.set(key, value);
    }
    await multi.exec();
  }
}
