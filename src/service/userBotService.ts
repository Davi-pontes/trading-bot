import bcrypt from 'bcrypt';
import { UserBotConfigRepository } from '../repository/userRepository';
import {
  ICreateUserBot,
  IUserAccountBalance,
  IUserBorService,
  IUserBotConfig,
  IUserBotConfigBase,
  IUserBotConfigUpdate,
  IUserSettingsTrading,
} from '../interfaces/UserBot';
import { Calculate } from './calculate';
import { ClientService } from './clientService';
import { TradingApiGateway } from '@/integration/tradingApiGateway';
import { TradingService } from './tradingService';
import { IOpenTrade } from '@/interfaces/Trading';

const repository = new UserBotConfigRepository();

export class UserBotConfigService implements IUserBorService {
  async create(configData: ICreateUserBot) {
    const hashedPassword = await bcrypt.hash(configData.password, 10);
    return repository.create({
      ...configData,
      password: hashedPassword,
      accessLevel: configData.accessLevel || 'USER',
    });
  }

  async getAll() {
    return repository.findAll();
  }

  async getDataAllUserLnMarket(): Promise<Array<any>> {
    try {
      const allUser = await repository.findAll();
      const usersInLnMarket = [];
      for (const user of allUser) {
        const lnInformationUser = this.getDataUserLnMarket(user);

        usersInLnMarket.push({ ...lnInformationUser, userId: user.id });
      }
      return usersInLnMarket;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }
  async getDataUserLnMarket(user: any) {
    try {
      const client = await ClientService.clientAuthentic({
        key: user.key,
        passphrase: user.passphrase,
        secret: user.secret,
      });
      return await TradingApiGateway.userGet(client);
    } catch (error) {
      console.log(error);
    }
  }
  async getDataProtectionUser(userId: number): Promise<any>{
    try {
      return await repository.findDataProtection(userId)
    } catch (error) {
      console.error(error);
      
    }
  }
  async getUserTradings(user: IUserBotConfig): Promise<IOpenTrade[]> {
    try {
      const client = await ClientService.clientAuthentic({
        key: user.key,
        passphrase: user.passphrase,
        secret: user.secret,
      });

      const tradingService = new TradingService();
      const tradingUser = await tradingService.getTradingRunningUser(client);

      return tradingUser.map((value: IOpenTrade) => ({
        ...value,
        userId: user.id,
      }));
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }
  async getById(id: number): Promise<ICreateUserBot> {
    const config = await repository.findByUserId(id);
    if (!config) throw new Error('Configuração não encontrada');
    return config;
  }
  async getTradingSettingsByUserId(userId: number): Promise<IUserSettingsTrading> {
    const credentials = await repository.findTradingSettingsByUserId(userId);

    if (!credentials) throw new Error('Credenciais não encontrada');

    return credentials;
  }
  async getPredefinitions(lastPrice: number): Promise<any> {
    return await repository.findPreDefinitions(lastPrice);
  }
  async update(id: number, data: IUserBotConfigUpdate) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return repository.update(id, data);
  }
  async decrementAccountBalance(
    balanceOld: IUserAccountBalance,
    decrement: number,
    userId: number,
  ) {
    const decrementedValues = {
      accountBalance: Calculate.calculateDecrementNumber(balanceOld.accountBalance, decrement),
      availableAccountBalance: Calculate.calculateDecrementNumber(
        balanceOld.availableAccountBalance,
        decrement,
      ),
    };
    return await repository.updateAccountBalance(decrementedValues, userId);
  }
  async incrementAvailableAccountBalance(
    balanceOld: IUserAccountBalance,
    decrement: number,
    userId: number,
  ): Promise<any> {
    const incrementedValues = {
      accountBalance: Calculate.calculateIncrementNumber(balanceOld.accountBalance, decrement),
      availableAccountBalance: Calculate.calculateIncrementNumber(
        balanceOld.availableAccountBalance,
        decrement,
      ),
    };

    return await repository.updateAccountBalance(incrementedValues, userId);
  }
  async delete(id: number) {
    return repository.delete(id);
  }
  async updateBalanceAllUser(allUserData: Array<any>): Promise<void> {
    try {
      for (const user of allUserData) {
        await this.updateBalanceUSer(user);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateBalanceUSer(user: any) {
    try {
      const data: IUserAccountBalance = {
        accountBalance: user.balance,
        availableAccountBalance: user.balance == 0 ? 0 : user.balance / 2,
      };
      await repository.updateAccountBalance(data, user.userId);
    } catch (error) {
      console.error(error);
    }
  }
}
