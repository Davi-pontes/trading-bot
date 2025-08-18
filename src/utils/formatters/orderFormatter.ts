import { INewTrade } from '@/interfaces/Trading';

export function formatOrder(data: any, value: number): INewTrade {
  const { userId, ...rest } = data;
  const hasPrice = 'price' in rest;

  return {
    ...rest,
    ...(hasPrice ? { takeprofit: value } : {}),
  };
}
