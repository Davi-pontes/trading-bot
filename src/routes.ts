import { Router } from 'express';
import { UserRouter } from './routes/userBot.routes';
import { OrderRouter } from './routes/order.routes';

const router = Router();

router.get('/', (_, res) => {
  res.send('Servidor funcionando!');
});

router.use('/user', UserRouter);
router.use('/order', OrderRouter);

export { router };
