// src/brain/SelfEvolution.ts
import { AgentFactory, CreatedAgent } from "./AgentFactory";

const factory = new AgentFactory();

/**
 * Evolves agents dynamically to match the current execution needs.
 */
export function evolveAgents(): CreatedAgent {
  const newAgent = factory.createAgent("optimizer");
  console.log("🚀 [SelfEvolution] New Agent Created dynamically:", newAgent);
  return newAgent;
}
