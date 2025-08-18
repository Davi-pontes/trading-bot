export function validateavailableAccountBalance(
  accountBalance: number | null,
  availableAccountBalance: number | null,
  totalOrder: number,
): boolean {
   if (accountBalance == null || availableAccountBalance == null)return false;

  if (availableAccountBalance && totalOrder <= availableAccountBalance) return true;
  
  else return false;
}
