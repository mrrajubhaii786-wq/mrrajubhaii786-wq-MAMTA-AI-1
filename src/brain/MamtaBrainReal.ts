import { MamtaBrainV15 } from "./MamtaBrainV15";
import { getOrCreateUser, checkUsage, incrementUserUsage, getDashboard, UserSubscriptionState } from "../services/SubscriptionService";

export class MamtaBrainReal extends MamtaBrainV15 {
  async processWithUser(input: string, sessionId: string, email?: string): Promise<{ text: string; userState: UserSubscriptionState; dashboard: any }> {
    const user = getOrCreateUser(sessionId, email);
    
    try {
      // Validate plan limits
      checkUsage(user);

      // Trigger underlying Multi-agent & AI Builder systems
      const rawResponse = await this.process(input, sessionId);
      
      // Increment token use/interaction count
      incrementUserUsage(sessionId);
      
      const updatedUser = getOrCreateUser(sessionId, email);
      const metrics = getDashboard(updatedUser);

      const decoratedResponse = `${rawResponse}

---
#### 📊 **SaaS Subscription Hub:**
- **Active Tier:** \`${metrics.planName}\` (${metrics.pricing})
- **Usage Index:** \`${metrics.usage} / ${metrics.limit === Infinity ? "Unlimited" : metrics.limit} operations\`
- **Remaining credits:** \`${metrics.remaining === Infinity ? "Unlimited" : metrics.remaining}\``;

      return {
        text: decoratedResponse,
        userState: updatedUser,
        dashboard: metrics
      };
    } catch (err: any) {
      const updatedUser = getOrCreateUser(sessionId, email);
      const metrics = getDashboard(updatedUser);
      
      const limitExceededMsg = `### ⛔ Subscription Limit Reached

You have fully consumed the credit bandwidth of your **${metrics.planName}** plan.

- **Current Usage:** \`${metrics.usage} / ${metrics.limit} operations\`
- **Remaining:** \`0\`

To continue using Mamta AI's autonomous Level 10 code generation engines, please upgrade to the **Pro** or **Premium** tier!

---
*Powered securely by Razorpay Unified UPI Gateway.*`;

      return {
        text: err.message.includes("limit reached") ? limitExceededMsg : `❌ Core error: ${err.message}`,
        userState: updatedUser,
        dashboard: metrics
      };
    }
  }
}
