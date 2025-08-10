import { config } from "dotenv";
import { z } from "zod";
config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  EMAIL_ADMIN: z.email("Email admin não encontrado ou em formato errado"),
  PASSWORD_ADMIN: z.string("Password admin não encontrado ou em formato errado"),
  DATABASE_URL: z.string(),
  //JWT_SECRET: z.string().min(10, "JWT_SECRET muito curto"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Erro nas variáveis de ambiente", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
