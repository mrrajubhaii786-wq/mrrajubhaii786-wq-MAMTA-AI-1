import { unifiedCoreInstance, UnifiedCycleOutput } from "./UnifiedCore";

export class UnifiedLoop {
  private core = unifiedCoreInstance;
  private intervalId: NodeJS.Timeout | null = null;
  private isActive: boolean = false;
  private lastTickTime: number = 0;
  private cycleHistory: UnifiedCycleOutput[] = [];
  
  // Custom injection variables initialized to robust defaults
  private inputError: number = 0.88;
  private inputGrowth: number = 88.0;
  private currentSignature: string = "HARDWARE_KEY";

  constructor() {
    // Automatically boot on load
    this.start();
  }

  public getStatus() {
    return {
      isActive: this.isActive,
      lastTickTime: this.lastTickTime,
      historyCount: this.cycleHistory.length,
      history: this.cycleHistory.slice(-30),
      config: {
        error: this.inputError,
        growth: this.inputGrowth,
        signature: this.currentSignature
      },
      stateSnapshot: this.core.getDiagnosticState()
    };
  }

  public async start() {
    if (this.isActive) return;
    this.isActive = true;
    await this.tick();

    this.intervalId = setInterval(async () => {
      await this.tick();
    }, 20000); // 20s tick frequency
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
  }

  public setConfig(error: number, growth: number, signature: string) {
    this.inputError = error;
    this.inputGrowth = growth;
    this.currentSignature = signature;
  }

  public async tick(): Promise<UnifiedCycleOutput | null> {
    this.lastTickTime = Date.now();
    try {
      const output = await this.core.runCycle({
        error: this.inputError,
        growth: this.inputGrowth,
        authSignature: this.currentSignature
      });

      this.cycleHistory.push(output);
      if (this.cycleHistory.length > 50) {
        this.cycleHistory.shift();
      }

      console.log(`🧠 [MAMTA AGI UNIFIED CORE TICK] Thought: ${output.thought} | Consensus: ${output.vote.approved ? "YES" : "NO"} | Decision: ${output.decision}`);
      return output;
    } catch (err) {
      console.error("❌ Exception during AGI Unified Core Tick:", err);
      return null;
    }
  }
}

export const unifiedLoopInstance = new UnifiedLoop();
