import { Server } from 'socket.io';
import { registerTradeHandlers } from './handlers/tradeHandler';

export function setupSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log(`Novo cliente conectado: ${socket.id}`);

    registerTradeHandlers(socket);
    //registerUserHandlers(socket);

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
}
