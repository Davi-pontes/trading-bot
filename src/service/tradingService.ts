import {
  ETradingStatus,
  INewTrade,
  IOpenTrade,
  IUpdateTrade,
} from "@/interfaces/Trading";
import { ClientService } from "./clientService";
import { TradingApiGateway } from "@/integration/tradingApiGateway";
import { BroomService } from "./broomService";
import { RedisService } from "./redisService";

export class TradingService {
  public async createBuyTradeLimit(
    dataOrders: INewTrade[],
    hangingOrderService: BroomService
  ) {
    try {
      for (const order of dataOrders) {
        const credential = ClientService.getCredentialsClient();

        const client = await ClientService.clientAuthentic(credential);

        const preDefinitiion = this.getPredifition();

        const takeprofit = this.calculateTakeProfit(
          order.price,
          preDefinitiion.profitPercentage
        );
        const formatedOrder = this.dataOrder(order, takeprofit);

        try {
          const createdOrder = await TradingApiGateway.futureNewTradeBuy(
            client,
            formatedOrder
          );
          console.log(createdOrder);
          await hangingOrderService.updateOrder(
            createdOrder,
            ETradingStatus.running,
            ETradingStatus.open,
            order.userId
          );
        } catch (error) {
          continue;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  public async createBuyTradeMarked(
    dataOrders: INewTrade,
    redisService: RedisService
  ) {
    try {
      const credential = ClientService.getCredentialsClient();

      const client = await ClientService.clientAuthentic(credential);

      const preDefinitiion = this.getPredifition();

      const takeprofit = this.calculateTakeProfit(
        dataOrders.price,
        preDefinitiion.profitPercentage
      );
      const formatedOrder = this.dataOrder(dataOrders, takeprofit);

      const createdOrder = await TradingApiGateway.futureNewTradeBuy(
        client,
        formatedOrder
      );
      const takeProfit = this.calculateTakeProfit(
        createdOrder.entry_price,
        preDefinitiion.profitPercentage
      );
      const dataToOrder: IUpdateTrade = {
        id: createdOrder.id,
        type: "takeprofit",
        value: takeProfit,
      };
      const updatedOrder = await TradingApiGateway.futuresUpdateTrade(
        client,
        dataToOrder
      );
      await redisService.saveTrade(
        updatedOrder,
        ETradingStatus.open,
        dataOrders.userId
      );
      console.log(updatedOrder);
    } catch (error) {
      console.error(error);
    }
  }
  public async addMarginTrade(datas: IOpenTrade, userId: string): Promise<IOpenTrade> {
    try {
      const credential = ClientService.getCredentialsClient();

      const client = await ClientService.clientAuthentic(credential);

      const amountSetMargin = ClientService.getAmountForSetMargin(userId);
      const dataOrderSetMargin = {
        id: datas.id,
        amount: amountSetMargin,
      };
      const addedMargin = TradingApiGateway.futuresAddMarginTrade(
        client,
        dataOrderSetMargin
      );
      console.log(addedMargin);
      return addedMargin
    } catch (error: any) {
      console.warn(error);
      return error;
    }
  }
  private calculateTakeProfit(price: number, profitPercentage: number): number {
    if (!price) return profitPercentage;
    const profit = price * (profitPercentage / 100);
    const takeProfit = price + profit;
    return Math.round(takeProfit);
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
  private dataOrder(data: any, value: number) {
    const { userId, ...rest } = data;
    const hasPrice = "price" in rest;

    return {
      ...rest,
      ...(hasPrice ? { takeprofit: value } : {}),
    };
  }
}
