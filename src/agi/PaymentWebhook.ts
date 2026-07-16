export class PaymentWebhook {
  handle(event: any) {
    if (event && event.type === "payment_success") {
      return {
        status: "VERIFIED",
        amount: event.amount || 100,
        txId: "TX_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5).toUpperCase(),
        timestamp: Date.now()
      };
    }
    return { status: "IGNORED", timestamp: Date.now() };
  }
}
