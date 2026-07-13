export interface LedgerTransaction {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  value: number;
  type: 'TRADE' | 'TAX' | 'MINT' | 'REWARD';
}

export class EconomyAI {
  public balance: number = 10000;
  private ledger: LedgerTransaction[] = [];

  constructor() {
    // Add some initial transaction logs
    this.processTransaction(2500, "Global Reserve System", "Civilization Treasury", "MINT");
    this.processTransaction(-500, "Civilization Treasury", "Nexus Hosting Node", "TRADE");
  }

  processTransaction(amount: number, from: string = "System", to: string = "Treasury", type: 'TRADE' | 'TAX' | 'MINT' | 'REWARD' = 'TRADE'): number {
    this.balance += amount;
    
    const tx: LedgerTransaction = {
      id: "tx_" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      from,
      to,
      value: Math.abs(amount),
      type
    };

    this.ledger.push(tx);
    if (this.ledger.length > 50) {
      this.ledger.shift();
    }

    return this.balance;
  }

  trade(from: string, to: string, value: number) {
    this.processTransaction(-value, from, to, 'TRADE');
    console.log(`💱 Trade Relay: ${from} ➔ ${to}: $${value}`);
  }

  getLedger() {
    return this.ledger;
  }
}
