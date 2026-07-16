import { GlobalExecution } from "./GlobalExecution";

const exec = new GlobalExecution();

export interface ExecutionRecord {
  timestamp: number;
  task: string;
  payload: any;
  success: boolean;
  status: string;
  result: any;
  securityProof?: string;
}

export class ExecutionLoop {
  private intervalId: NodeJS.Timeout | null = null;
  private isActive = false;
  private history: ExecutionRecord[] = [];
  private lastTickTime = 0;

  constructor() {
    this.start();
  }

  public start() {
    if (this.isActive) return;
    this.isActive = true;

    // Trigger immediate single task simulation on bootstrap
    this.tick();

    // Standard loop interval (20 seconds per specification)
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
    
    // Rotate simulated tasks to demonstrate versatile AGI capabilities
    const tasks = ["NOTIFY", "PAYMENT", "DEPLOY"];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    let payload: any = {};

    if (randomTask === "NOTIFY") {
      payload = { msg: `Mamta AI Heartbeat Alert - Global Active`, device: "Edge Engine Cluster 4" };
    } else if (randomTask === "PAYMENT") {
      payload = { amount: Math.floor(Math.random() * 500) + 10, currency: "INR", recipient: "Mamta AI Sovereignty Fund" };
    } else if (randomTask === "DEPLOY") {
      payload = { service: "mamta-core-node-tokyo", branch: "main", commit: "0x" + Math.random().toString(16).substr(2, 8) };
    }

    try {
      const runResult: any = await exec.process({
        task: randomTask,
        payload
      });

      console.log("⚡ EXECUTION LOOP STEP SUCCESS:", runResult);

      const record: ExecutionRecord = {
        timestamp: this.lastTickTime,
        task: randomTask,
        payload,
        success: runResult.success,
        status: runResult.status,
        result: runResult.result,
        securityProof: runResult.securityProof
      };

      this.history.push(record);
      if (this.history.length > 50) {
        this.history.shift(); // Evict older traces
      }
    } catch (err: any) {
      console.error("Error executing auto-tick step:", err);
    }
  }

  public getStatus() {
    return {
      isActive: this.isActive,
      lastTickTime: this.lastTickTime,
      historyCount: this.history.length,
      history: this.history
    };
  }

  public getExecEngine() {
    return exec;
  }
}

export const executionLoopInstance = new ExecutionLoop();
