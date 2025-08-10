import { ICreateUserBot, IUserBotConfigCreate, IUserBotConfigUpdate } from '@/interfaces/UserBot';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserBotConfigRepository {
  async create(data: ICreateUserBot) {
    return prisma.userBotConfig.create({ data });
  }

  async findAll() {
    return prisma.userBotConfig.findMany();
  }

  async findById(id: number) {
    return prisma.userBotConfig.findUnique({ where: { id } });
  }

  async update(id: number, data: IUserBotConfigUpdate) {
    return prisma.userBotConfig.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.userBotConfig.delete({ where: { id } });
  }
}