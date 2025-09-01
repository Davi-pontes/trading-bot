export function validatorRiskThresHold(
  liquidation: number,
  lastPrice: number,
  riskThreshold: number,
): boolean {
  const distancePrice = lastPrice - liquidation;

  if (distancePrice <= riskThreshold) return true;
  else return false;
}

export function validatorPricePassedStopGain(lastPrice: number, stopGain: number) {
  if (lastPrice > stopGain) return true;
  else return false;
}
