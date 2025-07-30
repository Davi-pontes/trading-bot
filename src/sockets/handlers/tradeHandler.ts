import { RedisClientProvider } from "@/config/redis";
import { INewTrade } from "@/interfaces/Trading";
import { RedisRepository } from "@/repository/redisRepository";
import { ClientService } from "@/service/clientService";
import { RedisService } from "@/service/redisService";
import { TradingService } from "@/service/tradingService";
import { Socket } from "socket.io";

export function registerTradeHandlers(socket: Socket) {
  socket.on("futureNewTradeBuy", async (trade: INewTrade) => {
    console.log("Compra de trade recebida:", trade);
    if (trade.type === "m") {
      const credentials = ClientService.getCredentialsClient();

      const client = await ClientService.clientAuthentic(credentials);

      const tradingService = new TradingService(client);

      tradingService.createBuyTrade(trade);
    } else {
      const redisClient = RedisClientProvider.getClient();

      const repository = new RedisRepository(redisClient);

      const service = new RedisService(repository);

      await service.saveTrade(trade);
    }
  });

  socket.on("futureNewTradeSell", async (trade: INewTrade) => {
    console.log("Venda de trade recebida:", trade);
  });
}
