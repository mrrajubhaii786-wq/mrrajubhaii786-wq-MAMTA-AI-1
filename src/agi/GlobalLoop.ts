import { GlobalCore } from "./GlobalCore";

export interface GlobalCycleHistory {
  timestamp: number;
  approved: boolean;
  status: string;
  votes: any[];
  result?: any;
  shardKey?: string;
}

export class GlobalLoop {
  private core = new GlobalCore();
  private intervalId: NodeJS.Timeout | null = null;
  private isActive = false;
  private history: GlobalCycleHistory[] = [];
  private lastTickTime = 0;

  constructor() {
    this.core.init();
    this.start();
  }

  public start() {
    if (this.isActive) return;
    this.isActive = true;
    
    // Automatically tick once on boot
    this.tick();

    // Loop interval set to 15 seconds as specified in Master Plan 34
    this.intervalId = setInterval(() => {
      this.tick();
    }, 15000);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
  }

  public tick() {
    this.lastTickTime = Date.now();
    try {
      const runResult = this.core.run({
        user: "global",
        payload: Math.random()
      });

      console.log("🌍 GLOBAL AGI:", runResult);

      const record: GlobalCycleHistory = {
        timestamp: this.lastTickTime,
        approved: runResult.approved,
        status: runResult.status,
        votes: runResult.votes,
        result: runResult.result,
        shardKey: runResult.shardKey
      };

      this.history.push(record);
      if (this.history.length > 50) {
        this.history.shift(); // Keep last 50 entries
      }
    } catch (err) {
      console.error("Error running global AGI cycle:", err);
    }
  }

  public getStatus() {
    return {
      isActive: this.isActive,
      lastTickTime: this.lastTickTime,
      historyCount: this.history.length,
      history: this.history,
      nodes: this.core.manager.getNodes().map(n => ({
        id: n.id,
        region: n.region,
        latency: n.latency,
        weight: n.weight,
        vote: n.vote,
        ip: n.ip,
        coords: n.coords
      })),
      shards: this.core.shard.getAllShards()
    };
  }

  public getCore() {
    return this.core;
  }
}

// Global loop singleton instance
export const globalLoopInstance = new GlobalLoop();
