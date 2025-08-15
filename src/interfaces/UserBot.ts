export type AccessLevel = "ADMIN" | "USER";

export interface IUserBotConfigBase {
  name: string;
  email: string;
  password: string;
  key: string;
  secret: string;
  passphrase: string;
  accessLevel?: AccessLevel;

  riskThreshold: number;
  amountForSetMargin: number;
  quantity: number;
  variation: number;
  leverage: number;
  balance: number;
  profitPercentage: number;
  from: number;
  evenPositive: number;
  evenNegative: number;
}
export interface ICreateUserBot {
  name: string;
  email: string;
  password: string;
  accessLevel?: AccessLevel;
}

export interface IUserBotConfig extends IUserBotConfigBase {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSettingsTrading {
  key: string | null;
  secret: string | null;
  passphrase: string | null;
  riskThreshold: number | null;
  amountForSetMargin: number | null;
  quantity: number | null;
  variation: number | null;
  leverage: number | null;
  balance: number | null;
  profitPercentage: number | null;
  from: number | null;
  evenPositive: number | null;
  evenNegative: number | null;
  accountBalance: number | null;
  availableAccountBalance: number | null;
}
export interface IUserCredentials {
  key: string;
  secret: string;
  passphrase: string;
}

export type IUserBotConfigCreate = IUserBotConfigBase;

export type IUserBotConfigUpdate = Partial<IUserBotConfigBase>;
