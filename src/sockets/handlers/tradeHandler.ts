import { RedisClientProvider } from '@/config/redis';
import { ETradingStatus, INewTrade, IPreDefinition } from '@/interfaces/Trading';
import { RedisRepository } from '@/repository/redisRepository';
import { RedisService } from '@/service/redisService';
import { TradingService } from '@/service/tradingService';
import { Socket } from 'socket.io';

export function registerTradeHandlers(socket: Socket) {
  // socket.on('futureNewTradeBuyMarket', async (trade: INewTrade) => {
  //   console.log('Compra de trade recebida:', trade);
  //   const clientRedis = RedisClientProvider.getClient();
  //   const repository = new RedisRepository(clientRedis);
  //   const redisService = new RedisService(repository);

  //   const tradingService = new TradingService();

  //   tradingService.createBuyTradeMarked(trade, redisService);
  // });
  socket.on('futureNewTradeBuyLimit', async (trade: INewTrade) => {
    const redisClient = RedisClientProvider.getClient();

    const repository = new RedisRepository(redisClient);

    const service = new RedisService(repository);

    await service.saveTrade(trade, ETradingStatus.pending, trade.userId);
  });

  socket.on('futureNewTradeRange', async (preDefinition: IPreDefinition) => {
    console.log('Adicionando pré definition', preDefinition);
    const redisClient = RedisClientProvider.getClient();

    const repository = new RedisRepository(redisClient);

    const service = new RedisService(repository);

    await service.saveTradePredefinition(preDefinition);
  });
  socket.on('futureNewTradeSell', async (trade: INewTrade) => {
    console.log('Venda de trade recebida:', trade);
  });
}
