export interface LearningObservation {
  id: string;
  timestamp: number;
  worldName: string;
  userCount: number;
  marketTrend: 'BULL' | 'BEAR';
  averageCapital: number;
  appliedExperiments: string[];
  insight: string;
}

export class LearningAI {
  public knowledge: LearningObservation[] = [];
  public autoOptimizationsApplied: string[] = [
    "Optimized buyer price threshold by 5% based on demand factors.",
    "Synchronized gig-payout scales with local bear market cycles."
  ];

  learn(world: any) {
    const timestamp = Date.now();
    const users = world.population.users || [];
    const totalMoney = users.reduce((sum: number, u: any) => sum + u.money, 0);
    const avgMoney = users.length > 0 ? Math.floor(totalMoney / users.length) : 0;

    let generatedInsight = "";
    if (world.trend === 'BULL' && avgMoney > 500) {
      generatedInsight = `High wealth density detected in ${world.name}. Ready for system scaling.`;
    } else if (world.trend === 'BEAR') {
      generatedInsight = `${world.name} is showing liquidity bottlenecks. Recommending stimulus.`;
    } else {
      generatedInsight = `Stable equilibrium observed in ${world.name} with consistent demand metrics.`;
    }

    const observation: LearningObservation = {
      id: `learn_${timestamp}_${Math.floor(Math.random() * 1000)}`,
      timestamp,
      worldName: world.name,
      userCount: users.length,
      marketTrend: world.trend,
      averageCapital: avgMoney,
      appliedExperiments: [...world.experimentsApplied],
      insight: generatedInsight
    };

    this.knowledge.unshift(observation);

    // Keep memory bounded to prevent overflow
    if (this.knowledge.length > 50) {
      this.knowledge.pop();
    }
  }

  getImprovementPlan(): string {
    if (this.knowledge.length > 10) {
      const bullCount = this.knowledge.filter(k => k.marketTrend === 'BULL').length;
      const bearCount = this.knowledge.length - bullCount;
      return `Autonomous System Learning Peak: Analyzed ${this.knowledge.length} state transitions. Bull-Bear balance is ${bullCount}:${bearCount}. Re-routing transaction structures to sustain high-volume macro nodes.`;
    }
    return "Gathering baseline behavioral profiles across worlds. Learning in progress...";
  }

  getObservations(): LearningObservation[] {
    return this.knowledge;
  }
}
