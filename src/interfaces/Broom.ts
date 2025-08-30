import { ETradingStatus, INewTrade, IOpenTrade, IPreDefinition } from './Trading';

export interface IBroomService {
  getOrdersByPrice(price: number): Promise<INewTrade[]>;
  getRunningOrders(): Promise<IOpenTrade[]>;
  getPreDefinitions(price: number): Promise<IPreDefinition[]>;
  updateOrderStatus(
    trade: INewTrade | IOpenTrade,
    oldStatus: ETradingStatus,
    newStatus: ETradingStatus,
    userId: number,
  ): Promise<void>;
  updateOrder(
    trade: INewTrade | IOpenTrade,
    oldStatus: ETradingStatus,
    newStatus: ETradingStatus,
    userId: number,
  ): Promise<void>;
  saveManyTrades(trade: INewTrade[]): Promise<void>;
  deleteManyPredenitions(preDefinitiionsToDelete: IPreDefinition[]): void;
}
