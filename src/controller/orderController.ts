import { Request, Response } from 'express';
import { RedisClientProvider } from '@/config/redis';
import { RedisRepository } from '@/repository/redisRepository';
import { RedisService } from '@/service/redisService';

export class OrderController {
  async getByUserId(req: Request, res: Response) {
    try {
      const redisClient = RedisClientProvider.getClient();
      const redisRepository = new RedisRepository(redisClient);
      const redisService = new RedisService(redisRepository);
      const userId = req.params.id;
      const result = await redisService.getOrdersByUserId(Number(userId));
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
