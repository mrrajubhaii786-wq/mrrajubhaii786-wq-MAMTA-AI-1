import Razorpay from "razorpay";

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: string;
}

let razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay | null {
  if (!razorpayInstance) {
    const key = process.env.RAZORPAY_KEY;
    const secret = process.env.RAZORPAY_SECRET;

    if (!key || !secret) {
      console.warn("⚠️ RAZORPAY_KEY or RAZORPAY_SECRET is missing. Payment service is operating in simulated mode.");
      return null;
    }

    try {
      razorpayInstance = new Razorpay({
        key_id: key,
        key_secret: secret,
      });
    } catch (err) {
      console.error("❌ Failed to initialize Razorpay SDK:", err);
      return null;
    }
  }
  return razorpayInstance;
}

export async function createPaymentOrder(amount: number): Promise<RazorpayOrder> {
  const rzp = getRazorpay();

  if (!rzp) {
    // Generate high-fidelity simulation order payload
    const simId = `order_sim_${Math.random().toString(36).substring(2, 11)}`;
    console.log(`💰 [Payment Simulator] Generated simulated order: ${simId} for ${amount} INR`);
    return {
      id: simId,
      amount: amount * 100, // in paisa
      currency: "INR",
      status: "created",
      receipt: `receipt_${Date.now()}`
    };
  }

  try {
    const order = await rzp.orders.create({
      amount: amount * 100, // amount in the smallest currency unit (paisa)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return {
      id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      status: order.status,
      receipt: order.receipt
    };
  } catch (err: any) {
    console.error("❌ Razorpay order creation failed:", err);
    throw new Error(`Razorpay Order creation failed: ${err.message}`);
  }
}
