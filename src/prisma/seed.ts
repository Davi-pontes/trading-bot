import { env } from '@/config/env';
import { UserBotConfigService } from '@/service/userBotService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const userService = new UserBotConfigService();

async function main() {
  // email do usuário inicial
  const defaultEmail = env.EMAIL_ADMIN;
  const defaultPassword = env.PASSWORD_ADMIN;

  const existingUser = await prisma.userBotConfig.findUnique({
    where: { email: defaultEmail },
  });

  if (!existingUser) {
    console.log('Nenhum usuário encontrado. Criando usuário inicial...');

    await userService.create({
      name: 'Administrador',
      email: defaultEmail,
      password: defaultPassword,
      accessLevel: 'ADMIN',
    });

    console.log('Usuário inicial criado com sucesso!');
  } else {
    console.log('Usuário inicial já existe. Nenhuma ação necessária.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
