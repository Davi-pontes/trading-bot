import { UserBotConfigService } from './userBotService';

export abstract class SynchronizrData {
  static async syncUserBalances(): Promise<void> {
    try {
      const userBotService = new UserBotConfigService();
      const allUsers = await userBotService.getDataUserLnMarket();
      return await userBotService.updateBalanceAllUser(allUsers);
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }
  static async syncTranding(): Promise<void>{
    try {
      
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }
}
