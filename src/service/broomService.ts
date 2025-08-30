import { IBroomService } from '@/interfaces/Broom';
import { RedisService } from './redisService';
import { ETradingStatus, INewTrade, IOpenTrade, IPreDefinition } from '@/interfaces/Trading';

export class BroomService implements IBroomService{
  constructor(private redisService: RedisService) {}

  async getOrdersByPrice(price: number): Promise<INewTrade[]> {
    return await this.redisService.getTradesByPrice(price);
  }
  async getRunningOrders(): Promise<IOpenTrade[]> {
    return await this.redisService.getRunningOrders();
  }
  async getPreDefinitions(price: number): Promise<IPreDefinition[]> {
    return await this.redisService.getPreDefinitionTrades(price);
  }
  async updateOrderStatus(
    trade: INewTrade | IOpenTrade,
    oldStatus: ETradingStatus,
    newStatus: ETradingStatus,
    userId: number,
  ): Promise<void> {
    return await this.redisService.updateTradeStatus(trade, oldStatus, newStatus, userId);
  }
  async updateOrder(
    trade: INewTrade | IOpenTrade,
    oldStatus: ETradingStatus,
    newStatus: ETradingStatus,
    userId: number,
  ): Promise<void> {
    return await this.redisService.updateTrade(trade, oldStatus, newStatus, userId);
  }
  async saveManyTrades(trade: INewTrade[]): Promise<void> {
    return await this.redisService.saveManyTrades(trade);
  }
  async deleteManyPredenitions(preDefinitiionsToDelete: IPreDefinition[]) {
    let preDefinitionDeleted = 0;
    for (let preDefinitiion of preDefinitiionsToDelete) {
      const key = `predefinition:${preDefinitiion.from}:${preDefinitiion.side}:${preDefinitiion.userId}`;
      this.redisService.deletePreDefinition(key);
      preDefinitionDeleted++;
    }
    return preDefinitionDeleted;
  }
}
