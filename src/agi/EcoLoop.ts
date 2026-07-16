import { ecoCoreInstance } from "./EcoCore";

export interface EcoLoopRecord {
  timestamp: number;
  goal: string;
  biz: string;
  money: {
    newBalance: number;
    timestamp: number;
    status: string;
  };
  task: {
    task: string;
    status: string;
    workerNode: string;
    executionId: string;
  };
  load: string;
}

export class EcoLoop {
  private intervalId: NodeJS.Timeout | null = null;
  private isActive = false;
  private history: EcoLoopRecord[] = [];
  private lastTickTime = 0;

  constructor() {
    this.start();
  }

  public start() {
    if (this.isActive) return;
    this.isActive = true;

    // Trigger immediate run on bootstrap
    this.tick();

    // Loop interval (20 seconds per specification)
    this.intervalId = setInterval(() => {
      this.tick();
    }, 20000);
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
    const goals = ["earn_money", "scale", "idle"];
    const randomGoal = goals[Math.floor(Math.random() * goals.length)];

    try {
      const runResult = ecoCoreInstance.run(randomGoal);

      const record: EcoLoopRecord = {
        timestamp: this.lastTickTime,
        goal: randomGoal,
        biz: runResult.biz,
        money: runResult.money,
        task: runResult.task,
        load: runResult.load
      };

      this.history.push(record);
      if (this.history.length > 50) {
        this.history.shift(); // Evict older traces
      }
    } catch (err) {
      console.error("Error in EcoLoop execution tick:", err);
    }
  }

  public getStatus() {
    return {
      isActive: this.isActive,
      lastTickTime: this.lastTickTime,
      historyCount: this.history.length,
      history: this.history,
      systemState: ecoCoreInstance.getState()
    };
  }
}

export const ecoLoopInstance = new EcoLoop();
