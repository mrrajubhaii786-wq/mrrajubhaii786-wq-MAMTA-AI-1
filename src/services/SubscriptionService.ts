export interface SubscriptionPlan {
  name: string;
  limit: number;
  price: number;
}

export const subscriptionPlans: Record<string, SubscriptionPlan> = {
  free: { name: "Free Tier", limit: 10, price: 0 },
  pro: { name: "Pro Developer", limit: 1000, price: 499 }, // INR 499
  premium: { name: "Enterprise Premium", limit: 999999, price: 999 } // INR 999
};

export interface UserSubscriptionState {
  uid: string;
  email: string;
  planKey: "free" | "pro" | "premium";
  usageCount: number;
  payments: Array<{
    id: string;
    amount: number;
    plan: string;
    timestamp: number;
  }>;
}

// In-memory state store for user subscriptions
// In a fully deployed Firestore scenario, this maps directly to a "subscriptions" collection.
const userDb: Map<string, UserSubscriptionState> = new Map();

export function getOrCreateUser(uid: string, email?: string): UserSubscriptionState {
  let user = userDb.get(uid);
  if (!user) {
    user = {
      uid,
      email: email || "anonymous@mamta.ai",
      planKey: "free",
      usageCount: 0,
      payments: []
    };
    userDb.set(uid, user);
  }
  return user;
}

export function checkUsage(user: UserSubscriptionState): void {
  const plan = subscriptionPlans[user.planKey];
  if (!plan) {
    throw new Error("Invalid active subscription plan.");
  }
  if (user.usageCount >= plan.limit) {
    throw new Error(`⚠️ Usage limit reached for ${plan.name}. Please upgrade your subscription plan to continue.`);
  }
}

export interface SaaSMetrics {
  planName: string;
  usage: number;
  limit: number;
  remaining: number;
  pricing: string;
}

export function getDashboard(user: UserSubscriptionState): SaaSMetrics {
  const plan = subscriptionPlans[user.planKey];
  const remaining = plan.limit === Infinity ? Infinity : plan.limit - user.usageCount;
  return {
    planName: plan.name,
    usage: user.usageCount,
    limit: plan.limit,
    remaining: remaining < 0 ? 0 : remaining,
    pricing: plan.price === 0 ? "Free" : `₹${plan.price}/mo`
  };
}

export function calculateRevenue(payments: Array<{ amount: number }>): number {
  return payments.reduce((total, p) => total + p.amount, 0);
}

export function handleUpgradeUser(uid: string, planKey: "free" | "pro" | "premium", paymentAmount: number): UserSubscriptionState {
  const user = getOrCreateUser(uid);
  user.planKey = planKey;
  
  // Record transaction
  user.payments.push({
    id: `pay_${Math.random().toString(36).substring(2, 11)}`,
    amount: paymentAmount,
    plan: planKey,
    timestamp: Date.now()
  });

  console.log(`💰 [SubscriptionService] Upgraded user "${uid}" to plan: "${planKey}" via payment of ₹${paymentAmount}.`);
  return user;
}

export function incrementUserUsage(uid: string): void {
  const user = getOrCreateUser(uid);
  user.usageCount += 1;
}
