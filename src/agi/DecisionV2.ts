import { ThinkingAI, ThinkingMetric } from "./ThinkingAI";
import { StrategyAI } from "./StrategyAI";

export interface DecisionResult {
  analysis: ThinkingMetric;
  action: "SAFE_MODE" | "OPTIMIZE_LOGIC" | "CONTINUE";
  timestamp: number;
}

export class DecisionV2 {
  private thinker = new ThinkingAI();
  private strategist = new StrategyAI();

  decide(input: any): DecisionResult {
    const analysis = this.thinker.analyze(input);
    const action = this.strategist.optimize(analysis);

    return {
      analysis,
      action,
      timestamp: Date.now()
    };
  }

  getStrategyDetails(action: "SAFE_MODE" | "OPTIMIZE_LOGIC" | "CONTINUE") {
    return this.strategist.getStrategyDetails(action);
  }
}
