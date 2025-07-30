import { ETradingStatus, INewTrade, IUpdatedTrade, IUpdateTrade } from "@/interfaces/Trading";

export abstract class TradingApiGateway {
  static async futureNewTradeBuy(client: any, data: INewTrade) {
    try {
      const newTrade = await client.futuresNewTrade(data);
      
      return newTrade;
    } catch (error) {
      console.error(error);
    }
  }
  static async futuresUpdateTrade(client: any, datas: IUpdateTrade): Promise<IUpdatedTrade> {
    try {
      const updated = await client.futuresUpdateTrade(datas);

      return updated;
    } catch (error: any) {
      console.error(error);
      return error
    }
  }
  static async futuresGetTrades(client: any, type: ETradingStatus) {
    try {
      const trades = await client.futuresGetTrades({ type });

      return trades;
    } catch (error) {
      console.log(error);
    }
  }
  static async futuresCancelTrade(client: any, idTrade: string): Promise<IUpdatedTrade> {
    try {
      const canceledTrade = await client.futuresCancelTrade(idTrade);

      return canceledTrade;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }
}
