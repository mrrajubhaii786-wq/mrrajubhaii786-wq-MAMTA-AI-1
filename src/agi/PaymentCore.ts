export class PaymentCore {
  process(amount: number, currency: string) {
    if (!amount) return { error: "INVALID_AMOUNT" };

    return {
      status: "SUCCESS",
      amount,
      currency,
      txId: "TX_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5).toUpperCase(),
      gateway: "stripe_live_gateway",
      timestamp: Date.now()
    };
  }
}
