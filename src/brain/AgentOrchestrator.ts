// src/brain/AgentOrchestrator.ts
import { SubAgent } from "./AgentBrain";

export interface AgentResult {
  agentName: string;
  result: string;
}

export async function runAgents(task: string): Promise<AgentResult[]> {
  const devAgent = new SubAgent("devAgent");
  const testAgent = new SubAgent("testAgent");
  const debugAgent = new SubAgent("debugAgent");
  const optimizeAgent = new SubAgent("optimizeAgent");

  const results = await Promise.all([
    devAgent.run(task).then(res => ({ agentName: "Developer Agent", result: res })),
    testAgent.run(task).then(res => ({ agentName: "QA Engineer Agent", result: res })),
    debugAgent.run(task).then(res => ({ agentName: "Debugger Agent", result: res })),
    optimizeAgent.run(task).then(res => ({ agentName: "Architect Agent", result: res }))
  ]);

  return results;
}
