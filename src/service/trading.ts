import { createWebsocketClient } from "@ln-markets/api";

interface ILnMarketsWebSocketClient {
  ws: any;
  disconnect: () => void;
  send: () => void;
  publicSubscribe: (channels: string[]) => Promise<void>;
  publicUnsubscribe: () => Promise<void>;
  publicPing: () => void;
  publicChannels: any;
}
interface ILastPriceBtcUsd {
  lastPrice: number;
  lastTickDirection: string;
  time: string;
}
export class Trading {
  private client!: ILnMarketsWebSocketClient;

  constructor() {
    this.controllerConnection();
  }
  async controllerConnection() {
    await this.connectionWebSocketLnMarkets();
    await this.subscribeChannels();
  }
  async connectionWebSocketLnMarkets() {
    try {
      this.client = await createWebsocketClient();
    } catch (error) {
      console.error(error);
    }
  }
  async subscribeChannels() {
    try {
      await this.client.publicSubscribe([
        "futures:btc_usd:last-price",
        "futures:btc_usd:index",
      ]);
    } catch (error) {
      console.error(error);
    }
  }
  lastPriceBtcUsd() {
    this.client.ws.on("futures:btc_usd:last-price",(lastPriceBtcUsd: ILastPriceBtcUsd) => {
        return lastPriceBtcUsd;
      }
    );
  }
  lastPriceBtcUsdIndex() {
    this.client.ws.on("futures:btc_usd:index", console.log);
  }
  disconnect() {
    this.client.disconnect();
  }
}
