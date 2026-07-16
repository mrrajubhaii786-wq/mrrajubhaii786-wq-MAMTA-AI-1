export class CivilizationAgents {
  agents = ["worker", "trader", "builder", "mediator", "sensor"];

  assign(task: string) {
    return this.agents.map(agent => ({
      agent,
      task,
      efficiency: Math.round((0.7 + Math.random() * 0.3) * 100) / 100,
      timestamp: Date.now()
    }));
  }

  getAgents() {
    return this.agents;
  }
}
