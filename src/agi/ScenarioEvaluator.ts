import { FutureScenario } from "./FutureSimulator";

export class ScenarioEvaluator {
  evaluate(futures: FutureScenario[]): FutureScenario {
    if (!futures || futures.length === 0) {
      return { id: 0, outcomeName: "Default State", outcome: 0.5, risk: 0.2, growth: 0.5 };
    }
    // Select the scenario that has the highest balanced value: growth - (0.5 * risk)
    return futures.reduce((best, current) => {
      const currentScore = current.growth - (current.risk * 0.5);
      const bestScore = best.growth - (best.risk * 0.5);
      return currentScore > bestScore ? current : best;
    }, futures[0]);
  }
}
