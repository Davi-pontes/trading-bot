import {
  ICreateUserBot,
  IUserBotConfigUpdate,
  IUserSettingsTrading,
} from "@/interfaces/UserBot";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserBotConfigRepository {
  async create(data: ICreateUserBot) {
    return prisma.userBotConfig.create({ data });
  }

  async findAll() {
    return prisma.userBotConfig.findMany();
  }

  async findTradingSettingsByUserId(
    userId: number
  ): Promise<IUserSettingsTrading | null> {
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
      },
      where: {
        id: userId,
      },
    });
  }

  async findByUserId(userId: number) {
    return prisma.userBotConfig.findUnique({ where: { id: userId } });
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

  async updateAvailableAccountBalance(value: number, userId: number) {
    return prisma.userBotConfig.update({
      data: {
        availableAccountBalance: value,
      },
      where: {
        id: userId,
      },
    });
  }
}