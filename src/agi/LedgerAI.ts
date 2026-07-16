export class LedgerAI {
  ledger: any[] = [];

  record(tx: any) {
    const entry = {
      ...tx,
      index: this.ledger.length,
      timestamp: Date.now(),
      signature: "MAMTA_LEDGER_SIG_" + Math.random().toString(36).substr(2, 9).toUpperCase()
    };
    this.ledger.push(entry);

    return {
      status: "RECORDED",
      total: this.ledger.length,
      entry
    };
  }

  getLedger() {
    return this.ledger;
  }
}
