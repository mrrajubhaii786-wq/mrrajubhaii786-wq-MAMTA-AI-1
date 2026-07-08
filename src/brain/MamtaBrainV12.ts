import { MindsetEngine } from "./MindsetEngine";
import { DecisionEngine } from "./DecisionEngine";
import { AgentManager } from "./AgentManager";
import { LearningEngine } from "./LearningEngine";
import { ConversationMemory } from "./ConversationMemory";
import { ContextEngine } from "./ContextEngine";
import { EmotionEngine } from "./EmotionEngine";
import { ResponseGeneratorV2 } from "./ResponseGeneratorV2";
import { SelfTrainer } from "./SelfTrainer";
import { ThinkingEngine, Thought, PlannerEngine, ExecutorEngine, VerificationEngine } from "./MamtaBrainV10";

export class MamtaBrainV12 {
  public mindset: MindsetEngine;
  public decision: DecisionEngine;
  private agents: AgentManager;
  public learning: LearningEngine;
  
  // Action Engines
  private thinker: ThinkingEngine;
  private planner: PlannerEngine;
  private executor: ExecutorEngine;
  private verifier: VerificationEngine;

  // Level 4 Human Like AI Engines
  public conversationMemory = new ConversationMemory();
  private contextEngine = new ContextEngine();
  private emotionEngine = new EmotionEngine();
  private responder = new ResponseGeneratorV2();
  private trainer = new SelfTrainer();

  private memory: { input: string; response: string; timestamp: number }[] = [];
  private cache: Map<string, string> = new Map();
  private knowledge: Record<string, string> = {};
  private isBusy: boolean = false;
  private trainingInterval: any = null;

  // Real-time Visual Pipeline Status Subscription
  private pipelineListeners: ((event: {
    step: 'idle' | 'thinking' | 'planning' | 'executing' | 'verifying';
    details?: string;
    goal?: string;
    plan?: { task: string; status: 'pending' | 'running' | 'completed' | 'failed' }[];
    currentTaskIndex?: number;
  }) => void)[] = [];

  constructor() {
    this.mindset = new MindsetEngine();
    this.decision = new DecisionEngine();
    this.agents = new AgentManager();
    this.learning = new LearningEngine();

    this.thinker = new ThinkingEngine();
    this.planner = new PlannerEngine();
    this.executor = new ExecutorEngine();
    this.verifier = new VerificationEngine();

    this.initBrain();
  }

  public subscribeToPipeline(cb: (event: any) => void) {
    this.pipelineListeners.push(cb);
    return () => {
      this.pipelineListeners = this.pipelineListeners.filter(listener => listener !== cb);
    };
  }

  private notifyPipeline(event: {
    step: 'idle' | 'thinking' | 'planning' | 'executing' | 'verifying';
    details?: string;
    goal?: string;
    plan?: { task: string; status: 'pending' | 'running' | 'completed' | 'failed' }[];
    currentTaskIndex?: number;
  }) {
    this.pipelineListeners.forEach(cb => {
      try {
        cb(event);
      } catch (err) {
        console.error("Pipeline notification listener error:", err);
      }
    });
  }

  private async initBrain() {
    try {
      await this.learning.init();
      this.knowledge = await this.learning.loadKnowledge();
      console.log("🔥 Mamta AI V12 Core Engine Initialized with Level 4 Self-Learning & Emotion Brain");
    } catch (err) {
      console.warn("Failed initializing learning engine in V12, fallback active:", err);
    }
    this.startSelfTrainingLoop();
  }

  private startSelfTrainingLoop() {
    if (typeof window !== "undefined" && !this.trainingInterval) {
      this.trainingInterval = setInterval(() => {
        console.log("🧠 Self-learning optimization running...");
        this.learning.optimize();
        this.optimizeBrainPatterns();
      }, 15000);
    }
  }

  public destroy() {
    if (this.trainingInterval) {
      clearInterval(this.trainingInterval);
      this.trainingInterval = null;
    }
  }

  private optimizeBrainPatterns() {
    if (this.memory.length > 5) {
      const counts: Record<string, number> = {};
      for (const m of this.memory) {
        const key = m.input.toLowerCase().trim();
        counts[key] = (counts[key] || 0) + 1;
      }
      const mostActive = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (mostActive && mostActive[1] > 1) {
        console.log(`[Self-Optimization V12] Promoting high-demand query pattern: "${mostActive[0]}"`);
      }
    }
  }

  private async aiBrain(input: string, sessionId: string, intent: string): Promise<string> {
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sessionId, 
          content: input, 
          pageSource: "home",
          intent: intent
        })
      });

      const data = await res.json();
      const reply = data.modelMessage?.content || data.reply || "";
      if (reply && !reply.includes("temporarily unreachable") && !reply.includes("unreachable")) {
        return reply;
      }
      console.log("⚠️ AI FAILED OR UNREACHABLE → LOCAL LEVEL 4 REASONING BRAIN");
      return this.conversationBrain(input);
    } catch (e) {
      console.log("⚠️ AI FAILED → LOCAL LEVEL 4 REASONING BRAIN", e);
      return this.conversationBrain(input);
    }
  }

  private conversationBrain(input: string): string {
    this.notifyPipeline({
      step: 'thinking',
      details: 'Generating human-like natural conversation...',
      goal: 'Level 4 Conversation Engine'
    });

    // STEP 1: SAVE USER MESSAGE TO MEMORY
    this.conversationMemory.add("user", input);

    // STEP 2: DETECT EMOTION
    const emotion = this.emotionEngine.detectEmotion(input);

    // STEP 3: CONTEXT ANALYSIS
    const context = this.contextEngine.analyze(
      input,
      this.conversationMemory.getFull()
    );

    // STEP 4: GENERATE RESPONSE
    let output = this.responder.generate(input, context, emotion);

    // STEP 5: SELF IMPROVEMENT ENGINE
    output = this.trainer.improve(output);

    // STEP 6: SAVE AI RESPONSE TO MEMORY
    this.conversationMemory.add("ai", output);

    this.notifyPipeline({
      step: 'idle',
      details: 'Natural response generated successfully.',
      goal: 'Level 4 Conversation Engine'
    });

    return output;
  }

  private async reasoningBrain(input: string, sessionId: string, intent: string): Promise<string> {
    this.notifyPipeline({
      step: 'thinking',
      details: `Activating deep neural reasoning layers for "${input}"...`,
      goal: 'Deep Reasoning AI'
    });
    const res = await this.aiBrain(input, sessionId, intent);
    this.notifyPipeline({
      step: 'idle',
      details: `Deep reasoning synthesis completed.`,
      goal: 'Deep Reasoning AI'
    });
    return res;
  }

  private plannerBrain(input: string): string {
    this.notifyPipeline({
      step: 'planning',
      details: `Synthesizing strategic plan blueprint...`,
      goal: 'Strategic Planning'
    });
    const thought = this.thinker.think(input);
    const plan = this.planner.createPlan(thought);
    const res = `## 📋 Mamta AI V12 Strategic Plan Blueprint\nGenerated for: "${input}"\n\n` + 
      plan.map((t, idx) => `**Step ${idx + 1}: ${t.task}**\n- *Status:* Ready for action execution in workspace\n- *Details:* Integrated safety checks with active learning database feedback loop enabled.`).join("\n\n");
    this.notifyPipeline({
      step: 'idle',
      details: `Strategic Plan blueprint formulated.`,
      goal: 'Strategic Planning'
    });
    return res;
  }

  private async agentBrain(input: string, intent: string): Promise<string> {
    this.notifyPipeline({
      step: 'executing',
      details: `Orchestrating multi-agent collaboration flow...`,
      goal: 'Multi-Agent Processing'
    });
    const res = await this.agents.runAgents(input, intent);
    this.notifyPipeline({
      step: 'idle',
      details: `Standby. Multi-Agent flow complete.`,
      goal: 'Multi-Agent Processing'
    });
    return res;
  }

  async process(input: string, sessionId: string): Promise<string> {
    if (this.isBusy) return "⏳ V12 Autonomous engine is currently processing a goal. Please wait...";

    this.isBusy = true;
    const intent = this.mindset.detectIntent(input);
    const decision = this.decision.decide(intent);

    console.log(`[MamtaBrainV12] Input: "${input}" | Intent: "${intent}" | Mode: "${decision.mode}"`);

    let response: string = "";

    if (input.startsWith("/build")) {
      this.isBusy = false;
      return "⚠️ Standard build operations are only allowed in the developer workspace console.";
    }

    // 1. Check L1 Cache first
    if (this.cache.has(input)) {
      this.isBusy = false;
      return this.cache.get(input)!;
    }

    // 2. Check Level 2 Dynamic Memory System
    const memoryResponse = await this.learning.recall(input);
    if (memoryResponse && decision.mode !== "AI") {
      console.log(`[Cognitive Recall L2 Hit] Mamta AI Serving learned memory for: "${input}"`);
      this.isBusy = false;
      return memoryResponse;
    }

    // 3. Multi Mindset System Routing (Dynamic Routing)
    if (decision.mode === "AGENT") {
      response = await this.agentBrain(input, intent);
    } else if (decision.mode === "PLAN") {
      response = this.plannerBrain(input);
    } else if (decision.mode === "AI") {
      response = await this.reasoningBrain(input, sessionId, intent);
    } else {
      response = this.conversationBrain(input);
    }

    // 4. Record to memory Logs
    this.memory.push({ input, response, timestamp: Date.now() });
    if (this.memory.length > 50) this.memory.shift();

    // 5. Commit learned insight to firestore database knowledge store
    await this.learning.learn(input, response, intent);
    const cleanedKey = input.toLowerCase().trim();
    this.knowledge[cleanedKey] = response;

    // 6. Store L1 cache
    this.cache.set(input, response);

    this.isBusy = false;
    return response;
  }
}
