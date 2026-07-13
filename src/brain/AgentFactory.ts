// src/brain/AgentFactory.ts

export interface CreatedAgent {
  role: string;
  task: string;
}

export class AgentFactory {
  /**
   * Spawns a dedicated task-oriented child agent dynamically.
   */
  createAgent(type: string): CreatedAgent {
    console.log("🧠 [AgentFactory] Creating new sub-agent for special task:", type);

    switch (type) {
      case "security":
        return { role: "Security Agent", task: "scan threats" };

      case "optimizer":
        return { role: "Optimizer Agent", task: "improve performance" };

      default:
        return { role: "General Agent", task: "assist" };
    }
  }
}
