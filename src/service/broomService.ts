import { RedisService } from "./redisService";
import { ETradingStatus, INewTrade, IOpenTrade, IPreDefinition } from "@/interfaces/Trading";

export class BroomService {
  constructor(private redisService: RedisService) {}

  async getOrdersByPrice(price: number): Promise<INewTrade[]> {
    return await this.redisService.getTradesByPrice(price);
  }
  async getOpenOrders(): Promise<IOpenTrade[]> {
    return await this.redisService.getOpenOrders();
  }
  async getPreDefinitions(price: number): Promise<IPreDefinition[]> {
    return await this.redisService.getPreDefinitionTrades(price);
  }
  async updateOrderStatus(trade: INewTrade | IOpenTrade, oldStatus: ETradingStatus, newStatus: ETradingStatus, userId: string): Promise<void>{
    return await this.redisService.updateTradeStatus(trade,oldStatus, newStatus,userId)
  }
  async updateOrder(trade: INewTrade | IOpenTrade, oldStatus: ETradingStatus, newStatus: ETradingStatus, userId: string): Promise<void>{
    return await this.redisService.updateTrade(trade,oldStatus, newStatus,userId)
  }
  async saveManyTrades(trade: INewTrade[]): Promise<void>{
    return await this.redisService.saveManyTrades(trade)
  }
  async deleteManyPredenitions(preDefinitiionsToDelete: IPreDefinition[]){
    let preDefinitionDeleted = 0
    for(let preDefinitiion of preDefinitiionsToDelete){
      const key = `predefinition:${preDefinitiion.from}:${preDefinitiion.side}:${preDefinitiion.userId}`
      this.redisService.deletePreDefinition(key)
      preDefinitionDeleted++
    }
    return preDefinitionDeleted
  }
}
