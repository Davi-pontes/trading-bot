import express, { Application } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Trading } from "./service/trading";

class App {
    public readonly app: Application;
    public server: HttpServer;
    public io: SocketIOServer;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = new SocketIOServer(this.server);

        this.middlewares();
        this.routes();
        this.sockets();
        this.listen();
    }

    private middlewares(): void {
        this.app.use(express.json());
    }

    private routes(): void {
        this.app.get("/", (req, res) => {
            res.send("Servidor funcionando!");
        });
    }
    private listen(): void {
        this.server.listen(8100, () => {
            console.log("Server running 8100");

        })
    }
    private sockets(): void {
        this.io.on("connection", (socket) => {
            console.log("Novo cliente conectado:", socket.id);
            const client = new Trading()
            
            socket.on("disconnect", () => {
                console.log("Cliente desconectado:", socket.id);
                client.disconnect()
            });
            socket.emit('lastPriceBtcUsd')
            // socket.on("boot", () => {
            //     client.lastPrice()
            // })
        });
    }
}

export default new App();
