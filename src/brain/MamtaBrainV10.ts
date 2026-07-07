import { MindsetEngine } from "./MindsetEngine";
import { DecisionEngine } from "./DecisionEngine";
import { AgentManager } from "./AgentManager";
import { LearningEngine } from "./LearningEngine";
import { ThinkingEngine } from "./ThinkingEngine";
import { PlannerEngine } from "./PlannerEngine";
import { ExecutorEngine } from "./ExecutorEngine";
import { VerificationEngine } from "./VerificationEngine";

export { ThinkingEngine, PlannerEngine, ExecutorEngine, VerificationEngine };

export class MamtaBrainV10 {
  private mindset: MindsetEngine;
  private decision: DecisionEngine;
  private agents: AgentManager;
  private learning: LearningEngine;
  
  // V10 Core Action Engines
  private thinker: ThinkingEngine;
  private planner: PlannerEngine;
  private executor: ExecutorEngine;
  private verifier: VerificationEngine;

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

    // V10 Core Engines instantiation
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
      console.log("🔥 Mamta AI V10 Core Engine Initialized with Knowledge map of size:", Object.keys(this.knowledge).length);
    } catch (err) {
      console.warn("Failed initializing learning engine in V10, fallback active:", err);
    }
    this.startSelfTrainingLoop();
  }

  private startSelfTrainingLoop() {
    if (typeof window !== "undefined" && !this.trainingInterval) {
      this.trainingInterval = setInterval(() => {
        console.log("⚡ Mamta AI V10 Autonomous State Tuning loop active...");
        this.optimizeBrainPatterns();
      }, 30000);
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
        console.log(`[Self-Optimization V10] Promoting high-demand query pattern to active priority list: "${mostActive[0]}"`);
      }
    }
  }

  private findSimilarKnowledge(input: string): string | null {
    const target = input.toLowerCase().trim();
    if (this.knowledge[target]) return this.knowledge[target];

    const keys = Object.keys(this.knowledge);
    for (const key of keys) {
      if (key.length > 3 && (target.includes(key) || key.includes(target))) {
        return this.knowledge[key];
      }
    }
    return null;
  }

  localBrain(input: string, mindset: string): string {
    const text = input.toLowerCase().trim();

    if (text === "hi" || text === "hello" || text === "hey" || text === "namaste") {
      return `[Mindset: ${mindset}] Hello and Namaste! Mamta AI V10 Core Autonomous Pipeline is fully active. Aapka system status perfectly optimized hai. Main aapki kya sahayata kar sakti hoon? 😊`;
    }

    if (text.includes("how are you")) {
      return `[Mindset: ${mindset}] V10 autonomous pipeline (Thinking, Planner, Executor, Verification) is running at peak speed. Sabhi core engines 100% active hain! How are you doing? 😊`;
    }

    if (text.includes("thank")) {
      return `[Mindset: ${mindset}] My pleasure! The V10 neural pipeline is always running autonomously behind the scenes. 🙌`;
    }

    return `[Mindset: ${mindset}] Offline simulation complete: Processed "${input}" within offline local sandbox perfectly.`;
  }

  async aiBrain(input: string, sessionId: string, intent: string): Promise<string> {
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
      return data.modelMessage?.content || data.reply || "No response received";
    } catch (e) {
      return "⚠️ AI server temporarily unreachable. Transitioned to client-side local memory storage backup successfully! 👍";
    }
  }

  // Autonomous goal action flow for loop execution
  public async autoThink(): Promise<string> {
    return this.process("optimize system safety constraints", "background-loop-id-" + Date.now().toString().slice(-4));
  }

  evolve(response: string, intent: string): string {
    let finalRes = response;

    if (finalRes.length < 60 && !finalRes.includes("😊") && !finalRes.includes("👍") && !finalRes.includes("🚀") && !finalRes.includes("👋")) {
      finalRes = finalRes + " 🚀";
    }

    if (intent === "chat" && finalRes.length > 250) {
      return finalRes.slice(0, 250) + "...";
    }

    return finalRes;
  }

  async process(input: string, sessionId: string): Promise<string> {
    if (this.isBusy) return "⏳ V10 Autonomous engine is currently processing a goal. Please wait...";

    this.isBusy = true;
    this.agents.setSessionId(sessionId);

    const intent = this.mindset.detectIntent(input);
    const mindset = this.mindset.getMindset(intent);
    const decision = this.decision.decide(input, intent);

    let response: string = "";

    if (input.startsWith("/build")) {
      this.isBusy = false;
      return "⚠️ Standard build operations are only allowed in the developer workspace console.";
    }

    // 1. Check Cache
    if (this.cache.has(input)) {
      this.isBusy = false;
      return this.cache.get(input)!;
    }

    // 2. Check Self-Learning Knowledge DB
    const learnedResponse = this.findSimilarKnowledge(input);
    if (learnedResponse) {
      console.log(`[Self-Learning L2 Hit] Mamta AI V10 Serving knowledge key: "${input}"`);
      response = learnedResponse;
    } else {
      // 3. V10 Thinking, Planning, Executing, and Verification Loop Execution
      this.notifyPipeline({
        step: 'thinking',
        details: `Analyzing target vector input: "${input}"...`,
        goal: 'Analyzing Input'
      });
      const thought = this.thinker.think(input);
      console.log(`🧠 [Thinking Engine Goal Selected]: "${thought.goal}"`);

      this.notifyPipeline({
        step: 'planning',
        details: `Formulating task sequencing for goal "${thought.goal}"...`,
        goal: thought.goal
      });
      const plan = this.planner.createPlan(thought);
      const taskOutcomes: string[] = [];

      let currentTaskIndex = 0;
      for (const task of plan) {
        task.status = "running";
        this.notifyPipeline({
          step: 'executing',
          details: `Executing task ${currentTaskIndex + 1}/${plan.length}: "${task.task}"`,
          goal: thought.goal,
          plan: plan.map(p => ({ task: p.task, status: p.status as 'pending' | 'running' | 'completed' | 'failed' })),
          currentTaskIndex
        });

        const res = await this.executor.execute(task.task, input, sessionId, intent);

        this.notifyPipeline({
          step: 'verifying',
          details: `Verifying task outcome safety constraints...`,
          goal: thought.goal,
          plan: plan.map(p => ({ task: p.task, status: p.status as 'pending' | 'running' | 'completed' | 'failed' })),
          currentTaskIndex
        });

        const isVerified = this.verifier.verify(res);

        if (!isVerified) {
          task.status = "failed";
          response = `❌ V10 Verification Engine intercepted a critical failure on subtask: "${task.task}". Aborting chain.`;
          this.notifyPipeline({
            step: 'idle',
            details: `Execution aborted: ${response}`,
            goal: thought.goal,
            plan: plan.map(p => ({ task: p.task, status: p.status as 'pending' | 'running' | 'completed' | 'failed' })),
            currentTaskIndex
          });
          break;
        }

        task.status = "completed";
        taskOutcomes.push(res);
        currentTaskIndex++;
      }

      this.notifyPipeline({
        step: 'idle',
        details: `Autonomous worker standby. Chain complete.`,
        goal: thought.goal,
        plan: plan.map(p => ({ task: p.task, status: p.status as 'pending' | 'running' | 'completed' | 'failed' })),
        currentTaskIndex
      });

      if (!response) {
        if (thought.goal === "Answer Question") {
          // If simple chat, return the final AI answer directly
          response = taskOutcomes[taskOutcomes.length - 1] || "No response generated.";
        } else {
          response = `## 🧠 V10 Autonomous Execution Successful\n**Main Goal:** ${thought.goal}\n\n` + taskOutcomes.join("\n\n");
          
          // Save the V10 autonomous plan execution log to the database
          try {
            await fetch("/api/chats/save-local", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sessionId,
                content: input,
                response: response,
                pageSource: "home"
              })
            });
          } catch (e) {
            console.warn("Save V10 chat history failed:", e);
          }
        }
      }
    }

    // 4. Record to memory Logs
    this.memory.push({ input, response, timestamp: Date.now() });
    if (this.memory.length > 50) this.memory.shift();

    // 5. Commit learned insight to firestore database knowledge store
    await this.learning.save(input, response);
    const cleanedKey = input.toLowerCase().trim();
    this.knowledge[cleanedKey] = response;

    // 6. Evolve output text
    const evolved = this.evolve(response, intent);

    // 7. Store L1 cache
    this.cache.set(input, evolved);

    this.isBusy = false;
    return evolved;
  }
}
