import { MamtaBrainV15 } from "./MamtaBrainV15";
import { getOrCreateUser, checkUsage, incrementUserUsage, getDashboard, UserSubscriptionState } from "../services/SubscriptionService";

export function isPlanningOrDevelopmentQuery(input: string): boolean {
  const clean = input.toLowerCase();
  
  // English keywords indicating planning, building, coding, compiling, running, database, launching, files, repositories
  const devKeywords = [
    'plan', 'build', 'develop', 'code', 'create', 'generate', 'compile', 'sandbox', 'project', 
    'execute', 'run', 'database', 'backend', 'deploy', 'launch', 'software', 'website', 'app',
    'program', 'html', 'css', 'javascript', 'typescript', 'react', 'node', 'python', 'java',
    'api', 'github', 'push', 'commit', 'repo', 'repository', 'drizzle', 'db', 'firestore', 'cloud',
    'docker', 'container', 'server', 'migration', 'sql', 'postgres', 'schema', 'setup', 'git'
  ];

  // Hindi/bilingual keywords indicating coding/development/planning/creation of apps/programs
  const hindiKeywords = [
    'बनाओ', 'कोड', 'डेवलप', 'प्लान', 'प्रोजेक्ट', 'सॉफ्टवेयर', 'ऐप', 'वेबसाइट', 'लांच', 
    'रन', 'कंपाइल', 'क्रिएट', 'डेटाबेस', 'बनाएं', 'तैयार', 'लिखो', 'बना', 'तैयार करो'
  ];

  const hasDevWord = devKeywords.some(word => clean.includes(word));
  const hasHindiWord = hindiKeywords.some(word => clean.includes(word));

  return hasDevWord || hasHindiWord;
}

export class MamtaBrainReal extends MamtaBrainV15 {
  async processWithUser(input: string, sessionId: string, email?: string): Promise<{ text: string; userState: UserSubscriptionState; dashboard: any }> {
    const user = getOrCreateUser(sessionId, email);
    const isDev = isPlanningOrDevelopmentQuery(input);
    
    try {
      if (isDev) {
        // Validate plan limits only for planning/development queries
        checkUsage(user);
      }

      // Trigger underlying Multi-agent & AI Builder systems
      const rawResponse = await this.process(input, sessionId);
      
      if (isDev) {
        // Increment token use/interaction count only for planning/development queries
        incrementUserUsage(sessionId);
      }
      
      const updatedUser = getOrCreateUser(sessionId, email);
      const metrics = getDashboard(updatedUser);

      // Label the operational stats nicely
      const decoratedResponse = `${rawResponse}

---
#### 📊 **SaaS Subscription Hub (Planning & Dev Limit):**
- **Active Tier:** \`${metrics.planName}\` (${metrics.pricing})
- **Usage Index:** \`${metrics.usage} / ${metrics.limit === Infinity ? "Unlimited" : metrics.limit} Dev Actions\`
- **Remaining credits:** \`${metrics.remaining === Infinity ? "Unlimited" : metrics.remaining}\`
- *Note: Conversation chats are 100% free and unlimited.*`;

      return {
        text: decoratedResponse,
        userState: updatedUser,
        dashboard: metrics
      };
    } catch (err: any) {
      const updatedUser = getOrCreateUser(sessionId, email);
      const metrics = getDashboard(updatedUser);
      
      const limitExceededMsg = `### ⛔ Development Limit Reached

You have fully consumed the planning and development bandwidth of your **${metrics.planName}** plan.

- **Current Usage:** \`${metrics.usage} / ${metrics.limit} Dev Actions\`
- **Remaining:** \`0\`

Conversational chats remain **100% free and unlimited**. However, to continue creating new projects, generating files, launching applications, or using Mamta AI's autonomous Level 10 code generation engines, please upgrade to the **Pro** or **Premium** tier!

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
