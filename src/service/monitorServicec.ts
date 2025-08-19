import { IPrice } from '@/interfaces/Price';
import { BroomService } from './broomService';
import { ETradingStatus, INewTrade } from '@/interfaces/Trading';
import { TradingService } from './tradingService';
import { ClientService } from './clientService';
import { RedisClientProvider } from '@/config/redis';
import { RedisRepository } from '@/repository/redisRepository';
import { RedisService } from './redisService';
import { IUserBorService } from '@/interfaces/UserBot';

export abstract class MonitorService {
  static async monitorHangingOrders(
    currentPrice: IPrice,
    hangingOrderService: BroomService,
  ): Promise<void> {
    try {
      const price = currentPrice.lastPrice;
      console.log(price);

      const orders = await hangingOrderService.getOrdersByPrice(price);
      console.log(orders);
      if (orders.length === 0) return;

      for (const order of orders) {
        console.log(
          `Executando ${order.side === 'b' ? 'compra' : 'venda'} para user ${order.userId}`,
        );
        await hangingOrderService.updateOrderStatus(
          order,
          ETradingStatus.pending,
          ETradingStatus.running,
          order.userId,
        );
      }

      const tradingService = new TradingService();

      const tradexecutedTradeing = await tradingService.createBuyTradeLimit(
        orders,
        hangingOrderService,
      );

      return tradexecutedTradeing;
    } catch (error) {
      console.log(error);
    }
  }
  static async monitorPreDefinition(currentPrice: IPrice, userBotService: IUserBorService, hangingOrderService: BroomService) {
    const preDefinitions = await userBotService.getPredefinitions(currentPrice.lastPrice);

    if (!preDefinitions.length) return;
    // Gera todas as ordens em memória
    const allTrades = preDefinitions.flatMap((preDef: any) => {
      const trades: INewTrade[] = [];
      for (
        let price = preDef.evenNegative + preDef.variation;
        price < preDef.evenPositive;
        price += preDef.variation
      ) {
        trades.push({
          userId: preDef.id,
          type: 'l',
          side: preDef.side,
          leverage: preDef.leverage,
          quantity: preDef.quantity,
          price,
        });
      }
      return trades;
    });
    await hangingOrderService.saveManyTrades(allTrades);
    return;
  }
  static async monitorMarginProtection(currentPrice: IPrice, hangingOrderService: BroomService) {
    const allOrdersOpen = await hangingOrderService.getOpenOrders();

    if (!allOrdersOpen.length) return;

    for (let orderOpen of allOrdersOpen) {
      if (orderOpen.userId) {
        const liquidationPrice = orderOpen.liquidation;
        const distancePrice = currentPrice.lastPrice - liquidationPrice;
        const riskThreshold = ClientService.getRiskThreshold(orderOpen.userId);
        if (distancePrice <= riskThreshold) {
          console.log(`⚠️ Ordem ${orderOpen.id} próxima de liquidação. Injetando margem...`);
          const tradingService = new TradingService();
          try {
            const addedMargin = await tradingService.addMarginTrade(orderOpen, orderOpen.userId);
            const redisClient = RedisClientProvider.getClient();

            const repository = new RedisRepository(redisClient);

            const redisService = new RedisService(repository);

            redisService.saveTrade(addedMargin, ETradingStatus.open, orderOpen.userId);
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  }
}
