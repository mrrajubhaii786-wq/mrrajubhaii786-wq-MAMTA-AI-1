import { FutureScenario } from "./FutureSimulator";

export class PredictiveDecision {
  decide(best: FutureScenario) {
    if (best.risk > 0.6) {
      return "SAFE_MODE";
    }
    if (best.growth > 0.65) {
      return "EXPAND";
    }
    return "OPTIMIZE";
  }
}
