import { DecisionV2, DecisionResult } from "./DecisionV2";
import { LearningMeta, LearningInsight } from "./LearningMeta";
import { ExternalOracle } from "./ExternalOracle";
import { AuthGuard } from "./AuthGuard";
import { TestAI, TestResult } from "./TestAI";
import { CanaryDeploy, CanaryStatus } from "./CanaryDeploy";

export interface MetaTickHistory {
  timestamp: number;
  signals: {
    systemLoad: number;
    trend: string;
    externalPing: number;
    timestamp: number;
  };
  result: DecisionResult;
  insights: LearningInsight[];
  testReport?: TestResult;
  canaryStatus?: CanaryStatus;
}

export class MetaLoop {
  private decision = new DecisionV2();
  private learning = new LearningMeta();
  private oracle = new ExternalOracle();
  private authGuard = new AuthGuard();
  private testAI = new TestAI();
  private canaryDeploy = new CanaryDeploy();

  private intervalId: NodeJS.Timeout | null = null;
  private isActive: boolean = false;
  private lastTickTime: number = 0;
  private history: MetaTickHistory[] = [];
  private activeTestCode: string = `// Meta Optimised Core Loop\nconst speedMultiplier = 1.25;\nconsole.log("Mamta AI dynamic logic active!");`;

  constructor() {
    // Automated initialization
  }

  public getStatus() {
    const currentSignals = {
      systemLoad: this.history[this.history.length - 1]?.signals?.systemLoad || 0.28,
      trend: this.history[this.history.length - 1]?.signals?.trend || "STABLE",
      externalPing: this.history[this.history.length - 1]?.signals?.externalPing || 24,
      timestamp: Date.now()
    };

    return {
      isActive: this.isActive,
      lastTickTime: this.lastTickTime,
      historyCount: this.history.length,
      history: this.history.slice(-30),
      currentSignals,
      currentDecision: this.history[this.history.length - 1]?.result || {
        analysis: { efficiency: 0.88, risk: 0.15, latency: 12, heuristicsUsed: [] },
        action: "CONTINUE",
        timestamp: Date.now()
      },
      learnings: this.learning.improve(this.history),
      authorizedKeys: this.authGuard.getAuthorizedKeys(),
      canaryStatus: this.canaryDeploy.getDeploys().slice(-1)[0] || null,
      testReport: this.testAI.runTests(this.activeTestCode)
    };
  }

  public async start() {
    if (this.isActive) return;
    this.isActive = true;
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
      // 1. Gather signals
      const signals = await this.oracle.getSignals();

      // 2. Formulate decision V2
      const result = this.decision.decide(signals);

      // 3. Keep logs history
      const tempHistoryItem = { signals, result };
      
      // Update local array for learning computation
      const recentHistory = [...this.history.map(h => h.result), result];
      const insights = this.learning.improve(recentHistory);

      // 4. Perform live pre-deployment canary test
      const testReport = this.testAI.runTests(this.activeTestCode);

      // 5. Build rolling deployment
      const canaryStatus = this.canaryDeploy.deploy(`v30.0.${this.history.length + 1}`);

      const fullHistoryItem: MetaTickHistory = {
        timestamp: Date.now(),
        signals,
        result,
        insights,
        testReport,
        canaryStatus
      };

      this.history.push(fullHistoryItem);

      if (this.history.length > 100) {
        this.history.shift();
      }

      console.log(`🧠 [META INTELLIGENCE TICK] Signal Trend: ${signals.trend} | Load: ${(signals.systemLoad * 100).toFixed(0)}% | Risk Metric: ${result.analysis.risk} | Action Choice: ${result.action}`);

    } catch (err) {
      console.error("❌ Exception during Meta Intelligence Tick:", err);
    }
  }

  public verifyAction(action: string, signature?: string) {
    return this.authGuard.verify(action, signature);
  }

  public runTestOnCode(code: string) {
    this.activeTestCode = code;
    return this.testAI.runTests(code);
  }

  public triggerCanaryDeploy(version: string) {
    return this.canaryDeploy.deploy(version);
  }
}

export const metaLoopInstance = new MetaLoop();
