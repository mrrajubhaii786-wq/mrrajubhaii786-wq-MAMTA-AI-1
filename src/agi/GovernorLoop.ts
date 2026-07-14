import { SystemGovernor, GovernorControlResult } from "./SystemGovernor";

export interface GovernorHistoryItem {
  timestamp: number;
  inputHealth: number;
  inputActions: string[];
  result: GovernorControlResult;
}

export class GovernorLoop {
  private governor = new SystemGovernor();
  private intervalId: NodeJS.Timeout | null = null;
  private isActive: boolean = false;
  private lastTickTime: number = 0;
  private history: GovernorHistoryItem[] = [];
  private activeActions: string[] = ["DEPLOY", "OPTIMIZE"];
  private currentHealth: number = 88; // Default initial health

  constructor() {
    // Standard initialization. Start background ticker when instantiated
    this.start();
  }

  public getStatus() {
    const defaultSignals = {
      market: "STABLE" as const,
      infra: "HEALTHY" as const,
      load: 0.22,
      timestamp: Date.now()
    };

    const latestResult: GovernorControlResult = this.history[this.history.length - 1]?.result || {
      systems: ["CONSCIOUSNESS", "META_INTELLIGENCE", "EVOLUTION", "SECURITY", "EXECUTION", "GOVERNOR"],
      signals: defaultSignals,
      priority: "EXPAND",
      conflict: false,
      decision: "PROCEED",
      uiValidation: { buttons: true, layout: true, errors: false, score: 1.0, checks: [] },
      nodeSyncStatus: [],
      timestamp: Date.now()
    };

    return {
      isActive: this.isActive,
      lastTickTime: this.lastTickTime,
      historyCount: this.history.length,
      history: this.history.slice(-30),
      currentHealth: this.currentHealth,
      activeActions: this.activeActions,
      latestResult,
      securityMode: "HMAC-SHA256 Hardware Level Verification Active"
    };
  }

  public async start() {
    if (this.isActive) return;
    this.isActive = true;
    await this.tick();

    this.intervalId = setInterval(async () => {
      await this.tick();
    }, 20000); // Trigger every 20 seconds as requested
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
  }

  public setConfig(health: number, actions: string[]) {
    this.currentHealth = health;
    this.activeActions = actions;
  }

  public async tick() {
    this.lastTickTime = Date.now();
    try {
      const result = await this.governor.control(
        { health: this.currentHealth },
        this.activeActions
      );

      const historyItem: GovernorHistoryItem = {
        timestamp: Date.now(),
        inputHealth: this.currentHealth,
        inputActions: [...this.activeActions],
        result
      };

      this.history.push(historyItem);

      if (this.history.length > 50) {
        this.history.shift();
      }

      console.log(`🛡️ [SYSTEM GOVERNOR TICK] Priority: ${result.priority} | Conflict Detected: ${result.conflict} | Decided Strategy: ${result.decision}`);
    } catch (err) {
      console.error("❌ Exception during AGI System Governor Tick:", err);
    }
  }

  public verifySignature(signature?: string) {
    return this.governor.verifySecuritySignature(signature);
  }
}

export const governorLoopInstance = new GovernorLoop();
