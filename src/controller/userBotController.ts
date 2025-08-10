import {Request,Response} from 'express'
import {UserBotConfigService} from '../service/userBotService'

const service = new UserBotConfigService();

export class UserBotConfigController {
  async create(req: Request, res: Response) {
    try {
      const result = await service.create(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAll(req: Request, res: Response) {
    const result = await service.getAll();
    res.json(result);
  }

  async getById(req: Request, res: Response) {
    try {
      const result = await service.getById(Number(req.params.id));
      res.json(result);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const result = await service.update(Number(req.params.id), req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}