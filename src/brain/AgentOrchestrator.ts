// src/brain/AgentOrchestrator.ts
import { SubAgent } from "./AgentBrain";
import { ConsensusEngine, Vote } from "./ConsensusEngine";

export interface AgentResult {
  agentName: string;
  result: string;
  vote?: Vote;
}

const consensus = new ConsensusEngine();

export async function runAgents(task: string): Promise<AgentResult[]> {
  const devAgent = new SubAgent("devAgent");
  const testAgent = new SubAgent("testAgent");
  const debugAgent = new SubAgent("debugAgent");
  const optimizeAgent = new SubAgent("optimizeAgent");

  const results = await Promise.all([
    devAgent.run(task).then(res => ({ agentName: "Developer Agent", result: res, vote: "APPROVE" as Vote })),
    testAgent.run(task).then(res => ({ agentName: "QA Engineer Agent", result: res, vote: "APPROVE" as Vote })),
    debugAgent.run(task).then(res => ({ agentName: "Debugger Agent", result: res, vote: "APPROVE" as Vote })),
    optimizeAgent.run(task).then(res => ({ agentName: "Architect Agent", result: res, vote: "APPROVE" as Vote }))
  ]);

  const votes = results.map(r => r.vote || "APPROVE");
  const decision = consensus.decide(votes);

  if (!decision) {
    throw new Error("❌ Consensus Rejected");
  }

  return results;
}
