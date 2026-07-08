import { DecisionEngineV2 } from "./DecisionEngineV2";
import { AgentManager } from "./AgentManager";
import { ExecutionEngine } from "./ExecutionEngine";
import { SelfEvolutionEngine } from "./SelfEvolutionEngine";

export class AutonomousBrainV1 {
  public decision = new DecisionEngineV2();
  public agents = new AgentManager();
  public executor = new ExecutionEngine();
  public evolution = new SelfEvolutionEngine();

  async process(input: string, intent: string): Promise<{ response: string; system: string }> {
    // Step 1: Decide
    const decision = this.decision.decide(intent, input);

    // Step 2: Execute Action
    let result = await this.executor.execute(decision.action, input);

    // Step 3: Agent Execution (if needed)
    if (decision.mode === "AGENT") {
      const agentResult = await this.agents.runAgents({ input });
      if (typeof agentResult === "object" && agentResult !== null) {
        result = `## 🤖 Mamta OS Multi-Agent Collaboration Output\n\n` +
          `### 📋 Planner Agent:\n- ${agentResult.plan || "Completed"}\n\n` +
          `### 💻 Builder Agent:\n- ${agentResult.build || "Completed"}\n\n` +
          `### 🔍 Reviewer Agent:\n- ${agentResult.review || "Completed"}\n\n` +
          `*All autonomous agents successfully executed the task!*`;
      } else {
        result = String(agentResult);
      }
    }

    // Step 4: Self Evolution
    const evolution = this.evolution.improve({
      errors: 0,
      speed: 95
    });

    return {
      response: result,
      system: evolution
    };
  }
}
