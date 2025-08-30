import { RedisClientType } from 'redis';
import { UserBotConfigService } from './userBotService';
import { RedisRepository } from '@/repository/redisRepository';
import { RedisService } from './redisService';

export abstract class SynchronizrData {
  static async syncUserBalances(): Promise<void> {
    try {
      const userBotService = new UserBotConfigService();
      const allUsers = await userBotService.getDataAllUserLnMarket();
      return await userBotService.updateBalanceAllUser(allUsers);
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }
  static async syncTrandingAllUsers(redisCLient: RedisClientType): Promise<void> {
    try {
      const userBotService = new UserBotConfigService();
      const allUsers = await userBotService.getAll();
      for (let user of allUsers) {
        const tradingsOfUser = await userBotService.getUserTradings(user);
        if(tradingsOfUser.length > 0){
          const redisRepository = new RedisRepository(redisCLient)
          const redisService = new RedisService(redisRepository);
          await redisService.deleteTradingRunningTheUser(user.id)
          await redisService.saveManyTrades(tradingsOfUser, 'running')
        }
      }
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }
}
