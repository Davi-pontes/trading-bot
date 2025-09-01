import { INewTrade } from '@/interfaces/Trading';
import { Calculate } from '@/service/calculate';

export function formatTradingLnMarket(data: any, value: number): INewTrade {
  const { userId, ...rest } = data;
  const hasPrice = 'price' in rest;

  return {
    ...rest,
    ...(hasPrice ? { takeprofit: value } : {}),
  };
}
export function formatTradingRedis(dataTrading: any, dataUser: any) {
  const { userId, ...restTrading } = dataTrading;

  return {
    ...restTrading,
    userId: dataUser.userId,
    stopGain: Calculate.calculateStopGain(dataTrading.price, dataUser.stopGain),
    statusStopGain: false,
  };
}
