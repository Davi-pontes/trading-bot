import { IUserSettingsTrading } from "@/interfaces/UserBot";
import { z } from "zod";

const credentialsSchema = z.object({
  key: z.string().min(1, "Key é obrigatória"),
  secret: z.string().min(1, "Secret é obrigatória"),
  passphrase: z.string().min(1, "Passphrase é obrigatória")
});

type TradingCredentials = z.infer<typeof credentialsSchema>;

export function validateCredentials(data: IUserSettingsTrading): TradingCredentials | null {
  const result = credentialsSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }
  return null;
}
