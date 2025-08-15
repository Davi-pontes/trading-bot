import { INewTrade } from "@/interfaces/Trading";

export abstract class Calculate {
  static calculateMargin(order: INewTrade) {
    if (order.leverage <= 0 || !order.quantity) {
      throw new Error("A alavancagem deve ser maior que 0");
    }

    const usd = order.quantity / order.leverage;

    const btc = usd / order.price;

    return { usd, btc };
  }
}
