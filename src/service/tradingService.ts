import { ETradingStatus, INewTrade, IOpenTrade, IUpdateTrade } from '@/interfaces/Trading';
import { ClientService } from './clientService';
import { TradingApiGateway } from '@/integration/tradingApiGateway';
import { BroomService } from './broomService';
import { UserBotConfigService } from './userBotService';
import { validateCredentials } from '@/utils/validators/validatorCredentials';
import { formatOrder } from '@/utils/formatters/orderFormatter';
import { Calculate } from './calculate';
import { validateavailableAccountBalance as validateAvailableAccountBalance } from '@/utils/validators/validatorBalance';

export class TradingService {
  public async createBuyTradeLimit(dataOrders: INewTrade[], hangingOrderService: BroomService) {
    try {
      for (const order of dataOrders) {
        const userBotService = new UserBotConfigService();

        const userSettingsTrading = await userBotService.getTradingSettingsByUserId(order.userId);
        if (userSettingsTrading) {
          const credentials = validateCredentials(userSettingsTrading);

          if (credentials) {
            const client = await ClientService.clientAuthentic(credentials);

            const takeprofit = this.calculateTakeProfit(
              order.price,
              userSettingsTrading.profitPercentage,
            );
            const formatedOrder = formatOrder(order, takeprofit);

            const orderMargin = Calculate.calculateMargin(order);

            const validateAvailableBalance = validateAvailableAccountBalance(
              userSettingsTrading.accountBalance,
              userSettingsTrading.availableAccountBalance,
              orderMargin.usd,
            );

            if (validateAvailableBalance) {
              try {
                const createdOrder = await TradingApiGateway.futureNewTradeBuy(
                  client,
                  formatedOrder,
                );
                console.log(createdOrder);
                const accountBalanceOld = {
                  accountBalance: userSettingsTrading.accountBalance as number,
                  availableAccountBalance: userSettingsTrading.availableAccountBalance as number,
                };

                await userBotService.decrementAccountBalance(
                  accountBalanceOld,
                  orderMargin.usd,
                  order.userId,
                );
                await hangingOrderService.updateOrder(
                  createdOrder,
                  ETradingStatus.running,
                  ETradingStatus.open,
                  order.userId,
                );
              } catch (error) {
                continue;
              }
            } else {
              console.log('Saldo insuficiente.');
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  // public async createBuyTradeMarked(
  //   dataOrders: INewTrade,
  //   redisService: RedisService
  // ) {
  //   try {
  //     const userBotConfigService = new UserBotConfigService()
  //     const userSettingsTrading =

  //     const credential = ClientService.getCredentialsClient();

  //     const client = await ClientService.clientAuthentic(credential);

  //     const preDefinitiion = this.getPredifition();

  //     const takeprofit = this.calculateTakeProfit(
  //       dataOrders.price,
  //       preDefinitiion.profitPercentage
  //     );
  //     const formatedOrder = this.dataOrder(dataOrders, takeprofit);

  //     const createdOrder = await TradingApiGateway.futureNewTradeBuy(
  //       client,
  //       formatedOrder
  //     );
  //     const takeProfit = this.calculateTakeProfit(
  //       createdOrder.entry_price,
  //       preDefinitiion.profitPercentage
  //     );
  //     const dataToOrder: IUpdateTrade = {
  //       id: createdOrder.id,
  //       type: "takeprofit",
  //       value: takeProfit,
  //     };
  //     const updatedOrder = await TradingApiGateway.futuresUpdateTrade(
  //       client,
  //       dataToOrder
  //     );
  //     await redisService.saveTrade(
  //       updatedOrder,
  //       ETradingStatus.open,
  //       dataOrders.userId
  //     );
  //     console.log(updatedOrder);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  public async addMarginTrade(datas: IOpenTrade, userId: number): Promise<IOpenTrade> {
    try {
      const credential = ClientService.getCredentialsClient();

      const client = await ClientService.clientAuthentic(credential);

      const amountSetMargin = ClientService.getAmountForSetMargin(userId);
      const dataOrderSetMargin = {
        id: datas.id,
        amount: amountSetMargin,
      };
      const addedMargin = TradingApiGateway.futuresAddMarginTrade(client, dataOrderSetMargin);
      console.log(addedMargin);
      return addedMargin;
    } catch (error: any) {
      console.warn(error);
      return error;
    }
  }
  public async getTradingOpenUser(client: any){
    try {
     return await TradingApiGateway.futuresGetTrades(client,ETradingStatus.open)
    } catch (error) {
      console.error(error);
    }
  }
  private calculateTakeProfit(price: number, profitPercentage: number | null): number {
    if (profitPercentage) {
      if (!price) return profitPercentage;
      const profit = price * (profitPercentage / 100);
      const takeProfit = price + profit;
      return Math.round(takeProfit);
    } else {
      return 0.8;
    }
  }
}
