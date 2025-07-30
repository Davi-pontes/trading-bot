import { IPrice } from "@/interfaces/Price";
import { BroomService } from "./broomService";
import { RedisService } from "./redisService";
import { INewTrade } from "@/interfaces/Trading";

export abstract class ValidationService {
  static async validateHangingOrders(
    currentPrice: IPrice,
    hangingOrderService: BroomService
  ): Promise<void> {
    const price = currentPrice.lastPrice;
    console.log(price);

    const orders = await hangingOrderService.getOrdersByPrice(price);
    console.log(orders);
    if (orders.length === 0) return;

    for (const order of orders) {
      console.log(
        `Executando ${order.side === "b" ? "compra" : "venda"} para user ${
          order.userId
        }`
      );
      await hangingOrderService.updateOrderStatus(order);
    }
  }
  static async validatePreDefinition(
    currentPrice: IPrice,
    redisService: RedisService
  ) {
    const preDefinitiion = {
      quantity: 2,
      variation: 50,
      leverage: 5,
      balance: 5000,
      winPercentage: 3,
      from: 118000,
      evenPositive: 119000,
      evenNegative: 117000,
    };
    if (currentPrice.lastPrice === preDefinitiion.from) {
      for (
        let i = preDefinitiion.evenNegative + preDefinitiion.variation;
        i < preDefinitiion.evenPositive;
        i += preDefinitiion.variation
      ) {
        const data: INewTrade = {
          userId: "davitesttss",
          type: "m",
          side: "b",
          leverage: preDefinitiion.leverage,
          quantity: preDefinitiion.quantity,
          price: i,
        };
        await redisService.saveTrade(data);
      }
    }
  }
}
