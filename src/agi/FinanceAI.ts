export class FinanceAI {
  decide(balance: number) {
    if (balance < 500) return "SAVE";
    if (balance < 2000) return "INVEST";
    return "EXPAND";
  }
}
