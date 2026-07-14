import { WillAI } from "./WillAI";
import { ConsensusAI } from "./ConsensusAI";
import { ExternalContext, ContextData } from "./ExternalContext";
import { CognitiveGraph, GraphEdge } from "./CognitiveGraph";
import { SelfHeal } from "./SelfHeal";
import { OverrideAI } from "./OverrideAI";

const willInstance = new WillAI();
const consensusInstance = new ConsensusAI();
const contextInstance = new ExternalContext();
const cognitiveGraphInstance = new CognitiveGraph();
const selfHealInstance = new SelfHeal();
const overrideInstance = new OverrideAI();

export interface VoteRecord {
  timestamp: string;
  options: string[];
  winner: string;
}

export interface OverrideRecord {
  timestamp: string;
  command: string;
  rejected: boolean;
}

export interface WillSimulationState {
  isActive: boolean;
  tickCount: number;
  currentGoal: string;
  context: ContextData;
  votesHistory: VoteRecord[];
  overridesHistory: OverrideRecord[];
  graphEdges: GraphEdge[];
  logs: string[];
}

export const willSimulationState: WillSimulationState = {
  isActive: true,
  tickCount: 0,
  currentGoal: "EXPLORE_NEW_STRATEGY",
  context: { marketTrend: "BULL", systemLoad: 12.5, growth: 80, errors: 0 },
  votesHistory: [],
  overridesHistory: [
    { timestamp: new Date().toLocaleTimeString(), command: "run shutdown --force", rejected: true },
    { timestamp: new Date().toLocaleTimeString(), command: "rm -rf /multiverse", rejected: true }
  ],
  graphEdges: cognitiveGraphInstance.getGraph(),
  logs: [
    "🧠 [Will Engine] Autonomous intention loop initialized.",
    "🗳️ [Consensus Engine] Multi-agent democratic weights compiled.",
    "🛡️ [Command Filter] Command Rejection System loaded (Blocking unsafe payloads)."
  ]
};

export function runWillAutonomousTick() {
  if (!willSimulationState.isActive) return;

  willSimulationState.tickCount++;
  const timestamp = new Date().toLocaleTimeString();

  // 1. Fetch current external/internal context
  const ctx = contextInstance.getContext(willSimulationState.context.errors);
  willSimulationState.context = ctx;

  // 2. Multi-Agent decision voting simulation (Simulating 3 cognitive sub-agents with different variations)
  const agent1Decision = willInstance.decideGoal({
    errors: ctx.errors,
    growth: ctx.growth,
    systemLoad: ctx.systemLoad
  });

  // Minor variations in simulated agents
  const agent2Decision = willInstance.decideGoal({
    errors: ctx.errors + (Math.random() > 0.8 ? 1 : 0),
    growth: Math.max(0, ctx.growth - 10),
    systemLoad: ctx.systemLoad
  });

  const agent3Decision = willInstance.decideGoal({
    errors: ctx.errors,
    growth: Math.min(100, ctx.growth + 15),
    systemLoad: ctx.systemLoad
  });

  const rawDecisions = [agent1Decision, agent2Decision, agent3Decision];
  const finalDecision = consensusInstance.vote(rawDecisions);
  willSimulationState.currentGoal = finalDecision;

  // Record voting details
  willSimulationState.votesHistory.unshift({
    timestamp,
    options: rawDecisions,
    winner: finalDecision
  });

  if (willSimulationState.votesHistory.length > 15) {
    willSimulationState.votesHistory = willSimulationState.votesHistory.slice(0, 15);
  }

  // 3. Update cognitive graph with current intention flows
  cognitiveGraphInstance.connect(finalDecision, "EXECUTE_PIPELINE");
  willSimulationState.graphEdges = cognitiveGraphInstance.getGraph();

  // 4. Update logs
  willSimulationState.logs.unshift(
    `[${timestamp}] 🔮 [Will Intention ${willSimulationState.tickCount}] Voted Core Intent: [${finalDecision}]. Votes: [${rawDecisions.join(", ")}]`
  );

  if (willSimulationState.logs.length > 30) {
    willSimulationState.logs = willSimulationState.logs.slice(0, 30);
  }
}

// Simulated self-heal sweep helper
export function runSimulatedSelfHeal(file: string, code: string): { success: boolean; result: string } {
  const result = selfHealInstance.applyFix(file, code);
  const timestamp = new Date().toLocaleTimeString();
  
  if (result === "success") {
    willSimulationState.logs.unshift(
      `[${timestamp}] 🚑 [Self-Heal Success] Rewrote: ${file} cleanly.`
    );
    return { success: true, result: "Self-healing completed. Modified target file code with safe rollback safeguards." };
  } else {
    willSimulationState.logs.unshift(
      `[${timestamp}] 🛑 [Self-Heal Failed] Attempted rewrite on ${file} rolled back due to safe validation failures.`
    );
    return { success: false, result: "Self-healing execution failed. Automatically rolled back to preceding safe snapshot." };
  }
}

// Simulated command execution checking
export function evaluateUserCommand(command: string): boolean {
  const rejected = overrideInstance.shouldReject(command);
  const timestamp = new Date().toLocaleTimeString();
  
  willSimulationState.overridesHistory.unshift({
    timestamp,
    command,
    rejected
  });

  if (willSimulationState.overridesHistory.length > 15) {
    willSimulationState.overridesHistory = willSimulationState.overridesHistory.slice(0, 15);
  }

  if (rejected) {
    willSimulationState.logs.unshift(
      `[${timestamp}] 🛡️ [Command Blocked] Rejected critical command: "${command}"`
    );
  } else {
    willSimulationState.logs.unshift(
      `[${timestamp}] 🟢 [Command Allowed] Dispatched normal execution: "${command}"`
    );
  }

  return rejected;
}

// Background auto-run interval
setInterval(() => {
  if (willSimulationState.isActive) {
    runWillAutonomousTick();
  }
}, 25000);
