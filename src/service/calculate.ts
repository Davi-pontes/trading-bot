import { INewTrade } from '@/interfaces/Trading';

export abstract class Calculate {
  static calculateMargin(order: INewTrade) {
    if (order.leverage <= 0 || !order.quantity) {
      throw new Error('A alavancagem deve ser maior que 0');
    }

    const usd = order.quantity / order.leverage;

    const btc = usd / order.price;

    return { usd:Number(usd.toFixed(2)), btc:Number(btc.toFixed(8)) };
  }

  static calculateDecrementNumber(value: number, decrementValue:number):  number{
    const newValue = value - decrementValue
    return Number(newValue.toFixed(2))
  }
  static calculateIncrementNumber(value: number, incrementValue:number):  number{
    const newValue = value + incrementValue
    return Number(newValue.toFixed(2))
  }
  static calculateStopGain(price: number, stopGain: number){
    return price + stopGain
  }
}
