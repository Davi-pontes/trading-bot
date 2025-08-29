import { ETradingStatus, INewTrade, IOpenTrade, IPreDefinition } from '@/interfaces/Trading';
import { RedisRepository } from '../repository/redisRepository';

export class RedisService {
  constructor(private repository: RedisRepository) {}

  async saveTrade(
    trade: INewTrade | IOpenTrade,
    status: ETradingStatus,
    userId: number,
  ): Promise<void> {
    const key = `${trade.price}:${status}:${trade.side}:${userId}`;
    const value = JSON.stringify(trade);
    await this.repository.set(key, value);
  }
  async saveTradePredefinition(preDefinitiion: IPreDefinition): Promise<void> {
    const key = `${'predefinition'}:${preDefinitiion.from}:${
      preDefinitiion.side
    }:${preDefinitiion.userId}`;
    const value = JSON.stringify(preDefinitiion);
    await this.repository.set(key, value);
  }
  async saveManyTrades(trades: INewTrade[] | IOpenTrade[], status: string = 'pending'): Promise<void> {
    if (!trades.length) return;

    const entries = trades.map((trade) => ({
      key: `${trade.price}:${status}:${trade.side}:${trade.userId}:${trade.id}`,
      value: JSON.stringify(trade),
    }));

    await this.repository.saveMany(entries);
  }
  async getTradesByPrice(price: number, range: number = 20): Promise<INewTrade[]> {
    try {
      const min = price - range;
      const max = price + range;
      const allValues: INewTrade[] = [];

      for (let p = min; p <= max; p++) {
        const pattern = `${p}:pending:*`;
        const keys = await this.repository.scanKeys(pattern);

        if (keys.length === 0) continue;

        const values = await this.repository.mGet(keys);

        const parsed = values
          .filter((val): val is string => typeof val === 'string')
          .map((val) => JSON.parse(val));

        allValues.push(...parsed);
      }

      return allValues;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }
  async getOpenOrders(): Promise<IOpenTrade[]> {
    try {
      const pattern = `*:open:*`;
      const keys = await this.repository.scanKeys(pattern);

      if (!keys.length) return [];

      const values = await this.repository.mGet(keys);

      const parsed: IOpenTrade[] = values
        .map((val, index) => {
          if (typeof val !== 'string') return null;

          try {
            const trade = JSON.parse(val) as IOpenTrade;
            const userId = keys[index].split(':')[3];
            return { ...trade, userId };
          } catch (error) {
            console.warn('Valor inválido no Redis:', val);
            return null;
          }
        })
        .filter((item): item is IOpenTrade & { userId: string } => item !== null);

      return parsed;
    } catch (error) {
      console.error('Erro ao buscar ordens abertas:', error);
      return [];
    }
  }
  async getPreDefinitionTrades(price: number, range: number = 100): Promise<IPreDefinition[]> {
    try {
      const min = price - range;
      const max = price + range;
      const allValues = [];

      for (let p = min; p <= max; p++) {
        const pattern = `predefinition:${p}:*`;
        const keys = await this.repository.scanKeys(pattern);

        if (keys.length === 0) continue;

        const values = await this.repository.mGet(keys);

        const parsed = values
          .filter((val): val is string => typeof val === 'string')
          .map((val) => JSON.parse(val));

        allValues.push(...parsed);
      }

      return allValues;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }
  async getOrdersByUserId(userId: number) {
    try {
      const pattern = `*:*:*:${userId}`;
      const keys = await this.repository.scanKeys(pattern);

      if (!keys.length) return [];

      const values = await this.repository.mGet(keys);

      const parsed = values
        .map((val, index) => {
          if (typeof val !== 'string') return null;

          try {
            const trade = JSON.parse(val);
            return { ...trade, userId };
          } catch (error) {
            console.error('Valor inválido no Redis', val);
            return null;
          }
        })
        .filter((item) => item !== null);

      return parsed;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async updateTradeStatus(
    trade: INewTrade | IOpenTrade,
    oldStatus: ETradingStatus,
    newStatus: ETradingStatus,
    userId: number,
  ): Promise<void> {
    const oldKey = `${trade.price}:${oldStatus}:${trade.side}:${userId}`;
    const newKey = `${trade.price}:${newStatus}:${trade.side}:${userId}`;

    const oldValue = await this.repository.get(oldKey);

    if (!oldValue) {
      return;
    }

    await this.repository.set(newKey, oldValue);
    await this.repository.del(oldKey);
  }
  async updateTrade(
    trade: INewTrade | IOpenTrade,
    oldStatus: ETradingStatus,
    newStatus: ETradingStatus,
    userId: number,
  ): Promise<void> {
    const oldKey = `${trade.price}:${oldStatus}:${trade.side}:${userId}`;
    const newKey = `${trade.price}:${newStatus}:${trade.side}:${userId}`;

    const value = JSON.stringify(trade);

    await this.repository.set(newKey, value);
    await this.repository.del(oldKey);
  }
  async deletePreDefinition(preDefinitionKey: string): Promise<void> {
    await this.repository.del(preDefinitionKey);
  }
  async deleteTradingRunningTheUser(userId: number): Promise<void> {
    const pattern = `*:running:*:${userId}:*`;
    const keys = await this.repository.scanKeys(pattern);

    if (!keys.length) return;

    await Promise.all(keys.map((key) => this.repository.del(key)));
  }
}
