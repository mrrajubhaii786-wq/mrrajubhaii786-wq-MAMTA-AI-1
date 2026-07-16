import { humanCoreInstance } from "./HumanCore";

export interface HumanLoopRecord {
  timestamp: number;
  userId: string;
  action: any;
  result: any;
}

export class HumanLoop {
  private intervalId: NodeJS.Timeout | null = null;
  private isActive = false;
  private history: HumanLoopRecord[] = [];
  private lastTickTime = 0;

  constructor() {
    this.start();
  }

  public start() {
    if (this.isActive) return;
    this.isActive = true;

    // Trigger immediate check-in on bootstrap
    this.tick();

    // Loop interval (15 seconds per specification)
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

  public async tick() {
    this.lastTickTime = Date.now();
    const userId = "user-1";
    
    // Simulate user interaction behaviors
    const simulatedActions = [
      { type: "view_page", page: "workspace", detail: "Checking cluster sharding state" },
      { type: "click_button", id: "run_job", detail: "Triggered execution core job" },
      { type: "update_setting", key: "shards", val: 5 },
      { type: "goal_added", goal: "build_app", detail: "Wants to build global scale platform" },
      { type: "goal_added", goal: "earn_money", detail: "Aims to monetize core AI services" }
    ];

    const randomAction = simulatedActions[Math.floor(Math.random() * simulatedActions.length)];

    try {
      const runResult = humanCoreInstance.process(userId, randomAction);

      const record: HumanLoopRecord = {
        timestamp: this.lastTickTime,
        userId,
        action: randomAction,
        result: runResult
      };

      this.history.push(record);
      if (this.history.length > 50) {
        this.history.shift(); // Evict older traces
      }
    } catch (err) {
      console.error("Error in HumanLoop execution tick:", err);
    }
  }

  public getStatus() {
    return {
      isActive: this.isActive,
      lastTickTime: this.lastTickTime,
      historyCount: this.history.length,
      history: this.history,
      currentProfile: humanCoreInstance.getProfile("user-1")
    };
  }
}

export const humanLoopInstance = new HumanLoop();
