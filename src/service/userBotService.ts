import bcrypt from 'bcrypt';
import {UserBotConfigRepository} from '../repository/userRepository'
import {IUserBotConfigCreate,IUserBotConfigUpdate} from '../interfaces/UserBot'

const repository = new UserBotConfigRepository();

export class UserBotConfigService {
  async create(configData: IUserBotConfigCreate) {
    const hashedPassword = await bcrypt.hash(configData.password, 10);
    return repository.create({
      ...configData,
      password: hashedPassword,
      accessLevel: configData.accessLevel || 'USER'
    });
  }

  async getAll() {
    return repository.findAll();
  }

  async getById(id: number) {
    const config = await repository.findById(id);
    if (!config) throw new Error('Configuração não encontrada');
    return config;
  }

  async update(id: number, data: IUserBotConfigUpdate) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return repository.update(id, data);
  }

  async delete(id: number) {
    return repository.delete(id);
  }
}