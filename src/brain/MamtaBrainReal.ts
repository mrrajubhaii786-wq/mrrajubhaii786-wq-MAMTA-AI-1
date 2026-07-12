import { MamtaBrainV15 } from "./MamtaBrainV15";
import { getOrCreateUser, checkUsage, incrementUserUsage, getDashboard, UserSubscriptionState } from "../services/SubscriptionService";
import { runCommand } from "./ExecutionEngine";
import { autoFix } from "./DebugEngine";
import { deploy } from "./DeployEngine";
import { decide, AutonomousState } from "./DecisionEngine";
import { AgentManagerReal } from "./AgentManagerReal";
import { callLocalLLM } from "./LocalLLMReal";
import { SelfLearningReal } from "./SelfLearningReal";
import { VectorMemory } from "./VectorMemory";
import { AgentBrain } from "./AgentBrain";
import { thinkDeep } from "./ThinkingEngineReal";
import { saveMemory } from "./CloudMemory";
import { ThinkingStream } from "./ThinkingStream";
import { ProjectMemory } from "./ProjectMemory";
import { ProjectBrain } from "./ProjectBrain";
import { realThink } from "./RealThinking";

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
  public agentsReal = new AgentManagerReal();
  public learningReal = new SelfLearningReal();
  public vector = new VectorMemory();
  public smartAgents = new AgentBrain();
  public thinking = new ThinkingStream();
  public projectMemory = new ProjectMemory();
  public projectBrain = new ProjectBrain();

  public async realThink(input: string, memory: any) {
    return await realThink(input, memory);
  }

  decide(state: AutonomousState) {
    return decide(state);
  }

  async build() {
    this.thinking.emit("⚙️ Building files...");
    const res = await runCommand("npm run build");
    if (res.success) {
      this.projectMemory.update({ status: "compiled", errors: [] });
    } else {
      this.projectMemory.update({ status: "failed", errors: [res.error || "Build compiling error"] });
    }
    return res;
  }

  async fix(error: string) {
    this.thinking.emit("🧠 Self-correcting and fixing errors...");
    const res = await autoFix(error);
    if (res.success) {
      this.projectMemory.update({ status: "fixed", errors: [] });
    } else {
      this.projectMemory.update({ status: "failed", errors: [res.error || "Fix failed"] });
    }
    return res;
  }

  async deploy() {
    this.thinking.emit("🚀 Deploying...");
    const res = await deploy();
    if (res.success) {
      this.projectMemory.update({ status: "deployed", errors: [] });
    } else {
      this.projectMemory.update({ status: "deploy-failed", errors: [res.error || "Deploy failed"] });
    }
    return res;
  }

  async process(input: string, sessionId: string): Promise<string> {
    // 1. Check Vector Memory RAG system search
    const vectorMatch = this.vector.search(input);
    if (vectorMatch) {
      console.log("🎯 [VectorMemory] Found matching past memory context:", vectorMatch.input);
      this.notifyPipeline({
        step: 'thinking',
        details: `🎯 Semantic hit! Recalling knowledge from vector memories: "${vectorMatch.input.substring(0, 30)}..."`,
        goal: 'Vector RAG Search Retrieval'
      });
      return `### 🎯 [Vector Memory RAG Retrieval] Mamta AI Deep Recall
${vectorMatch.output}

---
*🌌 Retrieved dynamically using character-embedding vector similarity search.*`;
    }

    // 2. Check traditional self-learning recall fallback
    const cachedMemory = this.learningReal.recall(input);
    if (cachedMemory) {
      this.notifyPipeline({
        step: 'thinking',
        details: 'Retrieving cognitive strategy from local evolution cache...',
        goal: 'Self-Learning Cache Retrieval'
      });
      return `### 🎯 [Memory Recall Mode] Mamta AI Optimized Path
${cachedMemory}

---
*🎓 Output retrieved directly from Self-Learning Evolution Cache.*`;
    }

    // Check if user specifically requested agent run or local LLM prompt
    const isSaaSMode = input.toLowerCase().includes("saas") || input.toLowerCase().includes("business");
    
    if (!isSaaSMode) {
      this.thinking.emit("🧠 Analyzing request...");
      this.notifyPipeline({
        step: 'thinking',
        details: 'Triggering Deep Thinking Engine & Local LLM Inference...',
        goal: 'Phase 3 Cognitive Deep Thinking'
      });

      // 3. Deep Thinking Layer
      this.thinking.emit("🧠 Running local L10 deep thinking engine...");
      const thinkingOutput = await thinkDeep(input);

      this.thinking.emit("📦 Planning project architecture and workflows...");
      this.notifyPipeline({
        step: 'planning',
        details: 'Dispatching Smart AgentBrain Swarm (Dev, QA, Debug, Architect)...',
        goal: 'Phase 2 Smart Multi-Agent Swarm'
      });

      // 4. Dispatch Collaborative Smart Agent Swarm (AgentBrain)
      this.thinking.emit("⚙️ Dispatching Smart Agent Swarm (Dev, QA, Debug)...");
      const agentResults = await this.smartAgents.run(thinkingOutput);

      const compositeResponse = `### 🧠 Mamta AI Deep Inference (World-Class L10 Core)

${thinkingOutput}

---
#### 🤖 **Consensus Swarm Review (AgentBrain):**
- **👨‍💻 Development:** ${agentResults[0]}
- **🧪 Quality Assurance:** ${agentResults[1]}
- **🐞 Debug Sweep:** ${agentResults[2]}
- **⚡ Core Architecture:** ${agentResults[3]}`;

      // 5. Save to local vector memory
      this.vector.store(input, compositeResponse);

      // 6. Save to self-learning evolution storage
      this.learningReal.learn(input, compositeResponse);

      // 7. Save to Cloud Memory (Firestore database)
      this.notifyPipeline({
        step: 'executing',
        details: 'Synchronizing newly compiled intelligence to Cloud Firestore Memory...',
        goal: 'Phase 4 Cloud Memory Sync'
      });
      await saveMemory(input, compositeResponse);

      this.notifyPipeline({
        step: 'idle',
        details: 'Mamta AI cognition and learning loops executed successfully!',
        goal: 'Task Completed'
      });

      return compositeResponse;
    }

    // Default back to CEO SaaS Business Formulation V15 build layers
    const finalRes = await super.process(input, sessionId);
    
    // Store in all memory layers
    this.vector.store(input, finalRes);
    this.learningReal.learn(input, finalRes);
    await saveMemory(input, finalRes);

    return finalRes;
  }

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
