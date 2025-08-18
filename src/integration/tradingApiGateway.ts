import { IAuthenticatedClient } from '@/interfaces/Client';
import {
  ETradingStatus,
  INewTrade,
  IOpenTrade,
  ISetMargin,
  IUpdateTrade,
} from '@/interfaces/Trading';

export abstract class TradingApiGateway {
  static async futureNewTradeBuy(
    client: IAuthenticatedClient,
    data: INewTrade,
  ): Promise<IOpenTrade> {
    try {
      const newTrade = await client.futuresNewTrade(data);

      return newTrade;
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }
  static async futuresUpdateTrade(
    client: IAuthenticatedClient,
    datas: IUpdateTrade,
  ): Promise<IOpenTrade> {
    try {
      const updated = await client.futuresUpdateTrade(datas);

      return updated;
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }
  static async futuresGetTrades(client: IAuthenticatedClient, type: ETradingStatus) {
    try {
      const trades = await client.futuresGetTrades({ type });

      return trades;
    } catch (error) {
      console.log(error);
    }
  }
  static async futuresCancelTrade(
    client: IAuthenticatedClient,
    idTrade: string,
  ): Promise<IOpenTrade> {
    try {
      const canceledTrade = await client.futuresCancelTrade(idTrade);

      return canceledTrade;
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }
  static async futuresAddMarginTrade(client: IAuthenticatedClient, datas: ISetMargin) {
    try {
      return await client.futuresAddMarginTrade(datas);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
