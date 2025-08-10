import express, { Application } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { PriceService } from "./service/priceService";
import { RedisClientProvider } from "./config/redis";
import { BroomService } from "./service/broomService";
import { MonitorService } from "./service/monitorServicec";
import { IPrice } from "./interfaces/Price";
import { RedisRepository } from "./repository/redisRepository";
import { RedisService } from "./service/redisService";
import { setupSocket } from "./sockets";
import RabbitMQ from "./config/amqp";
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
    await this.setupRabbitmq();
    await this.subscribeToLastPrice();
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
  private async setupRabbitmq(): Promise<void> {
    await RabbitMQ.init();

    const channel = RabbitMQ.getChannel();

    const queue = "last-price-lnm-btcusd";

    await channel.assertQueue(queue, { durable: true });
  }

  private async subscribeToLastPrice(): Promise<void> {
    const trading = await PriceService.connection();

    const broomService = new BroomService(this.redisService);
    console.log("✅ Get last price completed.");
    
    const channel = RabbitMQ.getChannel();
    
    trading.lastPriceBtcUsd((data: IPrice) => {
      channel.sendToQueue(
        "last-price-lnm-btcusd",
        Buffer.from(JSON.stringify(data))
      );
    });
    await channel.prefetch(1)
    
    channel.consume(
      "last-price-lnm-btcusd",
      async (msg) => {
        if (msg) {
          try {
            const data = JSON.parse(msg.content.toString());
            await MonitorService.monitorHangingOrders(data, broomService);
            await MonitorService.monitorPreDefinition(data,broomService);
            await MonitorService.monitorMarginProtection(data,broomService);
            channel.ack(msg);
          } catch (err) {
            console.error("Erro no processamento da mensagem", err);
            channel.nack(msg, false, true);
          }
        }
      },
      { noAck: false }
    );
  }
}

export default new App();
