import { distributedCoreInstance, DistributedCycleOutput } from "./DistributedCore";

export class DistributedLoop {
  private core = distributedCoreInstance;
  private intervalId: NodeJS.Timeout | null = null;
  private isActive: boolean = false;
  private lastTickTime: number = 0;
  private cycleHistory: DistributedCycleOutput[] = [];

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
      nodesSnapshot: this.core.manager.getNodes().map(n => ({
        id: n.id,
        state: n.state
      }))
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

  public async tick(): Promise<DistributedCycleOutput | null> {
    this.lastTickTime = Date.now();
    try {
      const output = await this.core.runCycle();

      this.cycleHistory.push(output);
      if (this.cycleHistory.length > 50) {
        this.cycleHistory.shift();
      }

      console.log(`🧠 [MAMTA DISTRIBUTED BRAIN TICK] Consensus: ${output.approved ? "APPROVED" : "VETOED"} | Decision: ${output.decision} | Nodes count: ${output.nodes.length}`);
      return output;
    } catch (err) {
      console.error("❌ Exception during AGI Distributed Brain Tick:", err);
      return null;
    }
  }

  public getCore() {
    return this.core;
  }
}

export const distributedLoopInstance = new DistributedLoop();
