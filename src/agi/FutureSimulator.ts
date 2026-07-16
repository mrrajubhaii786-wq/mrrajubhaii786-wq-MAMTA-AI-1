export interface FutureScenario {
  id: number;
  outcomeName: string;
  outcome: number;
  risk: number;
  growth: number;
}

export class FutureSimulator {
  simulate(state: any) {
    const scenarios: FutureScenario[] = [];
    const names = [
      "Optimal Convergence",
      "Economic Expansion",
      "System Equilibrium",
      "Stochastic Turmoil",
      "Policy Constrained"
    ];

    for (let i = 0; i < 5; i++) {
      const growthFactor = Number((Math.random() * 0.8 + 0.2).toFixed(2));
      const riskFactor = Number((Math.random() * 0.5 + 0.1).toFixed(2));
      scenarios.push({
        id: i + 1,
        outcomeName: names[i],
        outcome: Number((growthFactor * (1 - riskFactor)).toFixed(2)),
        risk: riskFactor,
        growth: growthFactor
      });
    }

    return scenarios;
  }
}
