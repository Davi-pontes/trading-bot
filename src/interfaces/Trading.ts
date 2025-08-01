export interface ILnMarketsWebSocketClient {
  ws: any;
  disconnect: () => void;
  send: () => void;
  publicSubscribe: (channels: string[]) => Promise<void>;
  publicUnsubscribe: () => Promise<void>;
  publicPing: () => void;
  publicChannels: any;
}
export interface ILastPriceBtcUsd {
  lastPrice: number;
  lastTickDirection: string;
  time: string;
}

export enum ETradingStatus {
  open = "open",
  running = "running",
  closed = "closed",
}
export interface IUpdateTrade {
  id: string;
  type: "stoploss" | "takeprofit";
  value: number;
}
export interface BaseTrade {
  userId: string
  type: "l" | "m";
  side: "b" | "s";
  leverage: number;
  price: number;
}

export type INewTrade =
  | (BaseTrade & { margin: number; quantity?: never })
  | (BaseTrade & { quantity: number; margin?: never });

export interface IUpdatedTrade{
  id: string,
  uid: string,
  type: "l" | "m",
  side: "b" | "s",
  opening_fee: number,
  closing_fee: number,
  maintenance_margin: number,
  quantity: number,
  margin: number,
  leverage: number,
  price: number,
  liquidation:number,
  stoploss: number,
  takeprofit: number,
  exit_price?: number,
  pl: number,
  creation_ts: number,
  market_filled_ts?: number,
  closed_ts?: number,
  entry_price: number,
  entry_margin: number,
  open: boolean,
  running: boolean,
  canceled: boolean,
  closed: boolean,
  sum_carry_fees: number
}