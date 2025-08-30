import {
  ICreateUserBot,
  IUserAccountBalance,
  IUserBotConfigUpdate,
  IUserSettingsTrading,
} from '@/interfaces/UserBot';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserBotConfigRepository {
  async create(data: ICreateUserBot) {
    return prisma.userBotConfig.create({ data });
  }

  async findAll() {
    return prisma.userBotConfig.findMany();
  }

  async findTradingSettingsByUserId(userId: number): Promise<IUserSettingsTrading | null> {
    return prisma.userBotConfig.findUnique({
      select: {
        key: true,
        secret: true,
        passphrase: true,
        riskThreshold: true,
        amountForSetMargin: true,
        quantity: true,
        variation: true,
        leverage: true,
        balance: true,
        profitPercentage: true,
        from: true,
        evenPositive: true,
        evenNegative: true,
        accountBalance: true,
        availableAccountBalance: true,
        stopGain: true,
      },
      where: {
        id: userId,
      },
    });
  }

  async findPreDefinitions(lastPrice: number): Promise<any> {
    return await prisma.userBotConfig.findMany({
      select: {
        id: true,
        quantity: true,
        variation: true,
        leverage: true,
        balance: true,
        profitPercentage: true,
        from: true,
        side: true,
        evenPositive: true,
        evenNegative: true,
      },
      where: {
        from: {
          gte: lastPrice - 50,
          lte: lastPrice + 50,
        },
        preDefinitionStatus: true,
      },
    });
  }

  async findByUserId(userId: number) {
    return prisma.userBotConfig.findUnique({ where: { id: userId } });
  }
  async findDataProtection(userId: number) {
    return prisma.userBotConfig.findUnique({
      select: {
        riskThreshold: true,
        stopGain: true,
        amountForSetMargin: true,
      },
      where: {
        id: userId,
      },
    });
  }
  async update(userId: number, data: IUserBotConfigUpdate) {
    return prisma.userBotConfig.update({
      where: { id: userId },
      data,
    });
  }

  async delete(userId: number) {
    return prisma.userBotConfig.delete({ where: { id: userId } });
  }

  async updateAccountBalance(values: IUserAccountBalance, userId: number) {
    return prisma.userBotConfig.update({
      data: values,
      where: {
        id: userId,
      },
    });
  }
}
