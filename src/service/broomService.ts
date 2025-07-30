import { RedisService } from "./redisService";
import { ITradeTest } from "@/interfaces/Trading";

export class BroomService {
  constructor(private redisService: RedisService) {}

  async getOrdersByPrice(price: number): Promise<ITradeTest[]> {
    return await this.redisService.getTradesByPrice(price);
  }
  async updateOrderStatus(trade: ITradeTest): Promise<void>{
    return await this.redisService.updateTradeStatus(trade)
  }
}
