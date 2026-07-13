// src/brain/AGIOS.ts
import { runAgents } from "./AgentOrchestrator";
import { CodeGenerator } from "./CodeGenerator";

export class AGIOS {
  private generator = new CodeGenerator();

  /**
   * Executes a task on the AGI Operating System core.
   */
  async execute(task: string): Promise<string> {
    console.log("🧠 [AGIOS] Received operating system task request:", task);

    const approval = await runAgents(task);
    if (!approval || approval.length === 0) {
      throw new Error("Blocked by swarm consensus");
    }

    const code = await this.generator.generateCode(task);
    return code;
  }
}
