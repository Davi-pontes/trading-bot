import bcrypt from "bcrypt";
import { UserBotConfigRepository } from "../repository/userRepository";
import {
  ICreateUserBot,
  IUserBotConfigCreate,
  IUserBotConfigUpdate,
  IUserSettingsTrading,
} from "../interfaces/UserBot";

const repository = new UserBotConfigRepository();

export class UserBotConfigService {
  async create(configData: ICreateUserBot) {
    const hashedPassword = await bcrypt.hash(configData.password, 10);
    return repository.create({
      ...configData,
      password: hashedPassword,
      accessLevel: configData.accessLevel || "USER",
    });
  }

  async getAll() {
    return repository.findAll();
  }

  async getById(id: number): Promise<ICreateUserBot> {
    const config = await repository.findByUserId(id);
    if (!config) throw new Error("Configuração não encontrada");
    return config;
  }

  async getTradingSettingsByUserId(userId: number): Promise<IUserSettingsTrading> {
    const credentials = await repository.findTradingSettingsByUserId(userId);

    if (!credentials) throw new Error("Credenciais não encontrada");

    return credentials;
  }
  async update(id: number, data: IUserBotConfigUpdate) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return repository.update(id, data);
  }
  async decrementAvailableAccountBalance(balanceOld: any, decrement:number, userId:number): Promise<any>{
    const newAvailableAccountBalance = balanceOld - decrement

    return await repository.updateAvailableAccountBalance(newAvailableAccountBalance,userId)
  }
  async incrementAvailableAccountBalance(balanceOld: number, decrement:number, userId:number): Promise<any>{
    const newAvailableAccountBalance = balanceOld + decrement

    return await repository.updateAvailableAccountBalance(newAvailableAccountBalance,userId)
  }
  async delete(id: number) {
    return repository.delete(id);
  }
}
