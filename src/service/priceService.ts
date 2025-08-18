import { ILastPriceBtcUsd, ILnMarketsWebSocketClient } from '@/interfaces/Trading';
import { createWebsocketClient } from '@ln-markets/api';

export class PriceService {
  private client!: ILnMarketsWebSocketClient;

  static async connection(): Promise<PriceService> {
    const instance = new PriceService();
    await instance.controllerConnection();
    return instance;
  }

  private async controllerConnection() {
    await this.connectionWebSocketLnMarkets();
    await this.subscribeChannels();
  }

  private async connectionWebSocketLnMarkets() {
    try {
      this.client = await createWebsocketClient();
    } catch (error) {
      console.error('Erro ao conectar ao WebSocket:', error);
    }
  }

  private async subscribeChannels() {
    try {
      await this.client.publicSubscribe(['futures:btc_usd:last-price', 'futures:btc_usd:index']);
    } catch (error) {
      console.error('Erro ao inscrever nos canais:', error);
    }
  }

  lastPriceBtcUsd(callback: (data: ILastPriceBtcUsd) => void) {
    this.client.ws.on('futures:btc_usd:last-price', callback);
  }

  lastPriceBtcUsdIndex() {
    this.client.ws.on('futures:btc_usd:index', console.log);
  }

  disconnect() {
    this.client.disconnect();
  }
}
