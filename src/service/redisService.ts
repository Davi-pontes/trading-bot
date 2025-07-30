// redis.service.ts
import { INewTrade } from "@/interfaces/Trading";
import { RedisRepository } from "../repository/redisRepository";

export class RedisService {
  constructor(private repository: RedisRepository) {}

  async saveTrade(
    trade: INewTrade,
    status: string = "pending"
  ): Promise<void> {
    const key = `${trade.price}:${status}:${trade.side}:${trade.userId}`;
    const value = JSON.stringify(trade);
    await this.repository.set(key, value);
  }

  async getTradesByPrice(price: number): Promise<INewTrade[]> {
    const pattern = `${price}:*`;
    const keys = await this.repository.scanKeys(pattern);
    const values = await this.repository.mGet(keys);

    return values
      .filter((val): val is string => typeof val === "string")
      .map((val) => JSON.parse(val));
  }

  async updateTradeStatus(trade: INewTrade): Promise<void> {
    const oldKey = `${trade.price}:${"pending"}:${trade.side}:${trade.userId}`;
    const newKey = `${trade.price}:${"running"}:${trade.side}:${trade.userId}`;

    const oldValue = await this.repository.get(oldKey);
    
    if (!oldValue) {
      return;
    }

    await this.repository.set(newKey, oldValue);
    await this.repository.del(oldKey);
  }
}