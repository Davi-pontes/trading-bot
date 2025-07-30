import {
  ETradingStatus,
  INewTrade,
  IUpdatedTrade,
  IUpdateTrade,
} from "@/interfaces/Trading";
import { ClientService } from "./clientService";
import { TradingApiGateway } from "@/integration/tradingApiGateway";

export class TradingService {
  constructor(private client: any) {}

  public async createBuyTrade(data: INewTrade) {
    try {
      const preDefinitiion = this.getPredifition();

      const takeprofit = this.calculateTakeProfit(
        data.price,
        preDefinitiion.profitPercentage
      );
      const order = this.dataOrder(data, takeprofit);

      await TradingApiGateway.futureNewTradeBuy(this.client, order);
      return;
    } catch (error) {
      console.error(error);
    }
  }

  private calculateTakeProfit(price: number, profitPercentage: number): number {
    if (!price) return profitPercentage;
    const profit = price * (profitPercentage / 100);
    const takeProfit = price + profit;
    return takeProfit;
  }

  private getPredifition() {
    return {
      quantity: 2,
      variation: 50,
      leverage: 5,
      balance: 5000,
      profitPercentage: 2,
      from: 118000,
      evenPositive: 119000,
      evenNegative: 117000,
    };
  }

  private dataOrder(data: any, takeprofit: number) {
    const { userId, ...rest } = data;
    return {
      ...rest,
    };
  }
}
