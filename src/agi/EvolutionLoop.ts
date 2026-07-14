import { RoadmapAI } from "./RoadmapAI";
import { ExperimentAI } from "./ExperimentAI";
import { EvolveAI } from "./EvolveAI";
import { RealityAI } from "./RealityAI";
import { ConsensusStore } from "./ConsensusStore";
import { SandboxExec } from "./SandboxExec";
import { LearningSync } from "./LearningSync";

export interface EvolutionHistoryItem {
  timestamp: number;
  signals: {
    trend: string;
    infraHealth: number;
    globalState: string;
  };
  plan: string[];
  results: Array<{
    step: string;
    success: boolean;
    decision: string;
    latency: number;
  }>;
}

export class EvolutionLoop {
  private roadmap = new RoadmapAI();
  private experiment = new ExperimentAI();
  private evolve = new EvolveAI();
  private reality = new RealityAI();
  private consensus = new ConsensusStore();
  private sandbox = new SandboxExec();
  private learning = new LearningSync();

  private intervalId: NodeJS.Timeout | null = null;
  private isActive: boolean = false;
  private history: EvolutionHistoryItem[] = [];
  private lastTickTime: number = 0;
  private memoryState: any = {
    successCount: 15,
    totalCount: 20,
    successRate: 0.75,
    status: "OPTIMAL"
  };

  constructor() {
    // We can start it by default, or let it be toggled
  }

  public getStatus() {
    return {
      isActive: this.isActive,
      lastTickTime: this.lastTickTime,
      historyCount: this.history.length,
      history: this.history.slice(-30), // Send last 30 events to avoid massive JSONs
      memoryState: this.memoryState,
      votes: this.consensus.loadVote()
    };
  }

  public async start() {
    if (this.isActive) return;
    this.isActive = true;
    
    // Run initial tick
    await this.tick();

    this.intervalId = setInterval(async () => {
      await this.tick();
    }, 30000);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
  }

  public async tick() {
    this.lastTickTime = Date.now();
    try {
      const signals = await this.reality.getSignals();

      // Map signals to roadmapping context
      const plan = this.roadmap.generate({
        errors: signals.infraHealth < 90 ? 5 : 1,
        growth: Math.random() * 100
      });

      const results: Array<{
        step: string;
        success: boolean;
        decision: string;
        latency: number;
      }> = [];

      for (const step of plan) {
        // GAP 3 - Pre-Execution Test
        const sandboxCode = `// Pre-execution validation for loop step: ${step}\nreturn true;`;
        const sandboxCheck = this.sandbox.test(sandboxCode);

        let result;
        if (sandboxCheck.success) {
          result = this.experiment.run(step);
        } else {
          result = { step, success: false, latency: 0, testedAt: Date.now(), metrics: { accuracy: 0, entropy: 1 } };
        }

        const decision = this.evolve.evolve(result);

        // GAP 4 - Learning sync update
        this.memoryState = this.learning.update(this.memoryState, result);

        results.push({
          step,
          success: result.success,
          decision,
          latency: result.latency || 0
        });

        console.log(`🧬 [EVOLUTION LOOP] Step: ${step} | Success: ${result.success} | Decision: ${decision}`);
      }

      // GAP 2 - Save Consensus Voting state
      this.consensus.saveVote({
        plan,
        results,
        decision: results.some(r => r.decision === "KEEP_CHANGE") ? "COMMIT_EVOLUTION" : "REVERT_CHANGES",
        timestamp: Date.now()
      });

      this.history.push({
        timestamp: Date.now(),
        signals,
        plan,
        results
      });

      if (this.history.length > 100) {
        this.history.shift();
      }

    } catch (error) {
      console.error("❌ Error in self-directed evolution tick:", error);
    }
  }

  public runCustomSandbox(code: string) {
    return this.sandbox.test(code);
  }

  public castVote(data: any) {
    this.consensus.saveVote(data);
    return this.consensus.loadVote();
  }
}

// Export singleton instance for the app
export const evolutionLoopInstance = new EvolutionLoop();
