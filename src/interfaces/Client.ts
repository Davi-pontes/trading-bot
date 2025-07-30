export interface IClientCredentials {
  key: string;
  passphrase: string;
  secret: string;
}
export interface IAuthenticatedClient{
  request: Function
  futuresGetTicker: Function,
  futuresNewTrade: Function,
  futuresUpdateTrade: Function,
  futuresCloseTrade: Function,
  futuresCloseAllTrades: Function,
  futuresCancelTrade: Function,
  futuresCancelAllTrades: Function,
  futuresCashinTrade: Function,
  futuresAddMarginTrade: Function,
  futuresGetTrades: Function,
  futuresPriceHistory: Function,
  futuresIndexHistory: Function,
  futuresFixingHistory: Function,
  futuresCarryFeesHistory: Function,
  userGet: Function,
  userUpdate: Function,
  userDeposit: Function,
  userDepositHistory: Function,
  userWithdraw: Function,
  userWithdrawUsd: Function,
  userWithdrawHistory: Function,
  optionsInstrument: Function,
  optionsInstruments: Function,
  optionsMarket: Function,
  optionsNewTrade: Function,
  optionsGetTrades: Function,
  optionsCloseTrade:Function,
  optionsCloseAllTrades: Function,
  optionsUpdateSettlement: Function
}