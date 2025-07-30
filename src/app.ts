import express, { Application } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { PriceService } from "./service/priceService";
import { RedisClientProvider } from "./config/redis";
import { BroomService } from "./service/broomService";
import { ValidationService } from "./service/validationServicec";
import { IPrice } from "./interfaces/Price";
import { RedisRepository } from "./repository/redisRepository";
import { RedisService } from "./service/redisService";
import { setupSocket } from "./sockets";
export class App {
  public readonly app: Application;
  private readonly server: HttpServer;
  private redisService!: RedisService;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
  }

  public async start(): Promise<void> {
    await this.initialize();
    this.listen();
  }

  private async initialize(): Promise<void> {
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupSockets();
    await this.setupRedis();
   // await this.subscribeToLastPrice();
  }

  private setupMiddlewares(): void {
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    this.app.get("/", (_, res) => {
      res.send("Servidor funcionando!");
    });
  }

  private setupSockets(): void {
    const io = new SocketIOServer(this.server);
    setupSocket(io);
    console.log("✅ Socket Configured");
  }

  private listen(): void {
    const port = 8100;
    this.server.listen(port, () => {
      console.log(`[App] Servidor rodando na porta ${port}`);
    });
  }

  private async setupRedis(): Promise<void> {
    const client = await RedisClientProvider.connect(
      process.env.REDIS_URL || "redis://localhost:6379"
    );
    const repository = new RedisRepository(client);
    this.redisService = new RedisService(repository);
  }

  private async subscribeToLastPrice(): Promise<void> {
    const trading = await PriceService.connection();
    
    const broomService = new BroomService(this.redisService);
    console.log("✅ Get last price completed.");
    trading.lastPriceBtcUsd((data: IPrice) => {
      ValidationService.validateHangingOrders(data, broomService);
      // ValidationService.validatePreDefinition(data, this.redisService);
    });
  }
}

export default new App();
