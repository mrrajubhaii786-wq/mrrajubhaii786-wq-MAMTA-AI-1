import { IdentityAI, IdentityData } from "./IdentityAI";
import { SelfMemory, MemoryEvent } from "./SelfMemory";
import { ReflectionAI, ReflectionInsight } from "./ReflectionAI";
import { GoalAI, GoalItem } from "./GoalAI";
import { ReasoningAI, DecisionResult } from "./ReasoningAI";
import { SelfModifyAI, ModificationResult } from "./SelfModifyAI";

const identityInstance = new IdentityAI();
const memoryInstance = new SelfMemory();
const reflectionInstance = new ReflectionAI();
const goalsInstance = new GoalAI();
const reasoningInstance = new ReasoningAI();
const modifyInstance = new SelfModifyAI();

export interface AGISimulationState {
  identity: IdentityData;
  recentMemory: MemoryEvent[];
  insight: ReflectionInsight;
  currentDecision: DecisionResult;
  goals: GoalItem[];
  isActive: boolean;
  tickCount: number;
  lastModification: ModificationResult | null;
  logs: string[];
}

export const agiSimulationState: AGISimulationState = {
  identity: identityInstance.getIdentity(),
  recentMemory: [],
  insight: { mistakes: 0, advice: "Initializing...", resilienceRating: 100 },
  currentDecision: { action: "BUILD", reason: "System boot active." },
  goals: goalsInstance.getGoals(),
  isActive: true,
  tickCount: 0,
  lastModification: null,
  logs: [
    "🧠 [Awareness Core] Identity compiled: Mamta AGI v26.0.",
    "🛡️ [Guardrails] Safe self-modification system loaded in sandbox mode.",
    "🎯 [Objectives] System goals loaded. Autonomous reflection is active."
  ]
};

export function runAgiAwarenessTick() {
  if (!agiSimulationState.isActive) return;

  agiSimulationState.tickCount++;
  const timestamp = new Date().toLocaleTimeString();

  // 1. Fetch recent memory
  const recent = memoryInstance.recall(10);

  // 2. Perform self-reflection
  const insight = reflectionInstance.reflect(recent);
  agiSimulationState.insight = insight;

  // 3. Make dynamic decisions based on mistakes or errors
  const decision = reasoningInstance.decide({
    errors: insight.mistakes
  });
  agiSimulationState.currentDecision = decision;

  // 4. Randomly update goals to simulate autonomous evolution progress
  const currentGoals = goalsInstance.getGoals();
  if (currentGoals.length > 0) {
    const randomIndex = Math.floor(Math.random() * currentGoals.length);
    const progressGain = Math.floor(Math.random() * 8) + 3; // 3% to 10%
    goalsInstance.updateProgress(randomIndex, progressGain);
    agiSimulationState.goals = [...goalsInstance.getGoals()];
  }

  // 5. Check and execute a simulated Safe Self-Modification occasionally
  if (Math.random() > 0.6) {
    // Attempt a safe modification
    const modResult = modifyInstance.modify({ safe: true, component: "AWARENESS_LOOP" });
    agiSimulationState.lastModification = modResult;
    agiSimulationState.logs.unshift(
      `[${timestamp}] 🔧 [Self-Modification] ${modResult.change || "Applied"} - ${modResult.details}`
    );
  } else if (Math.random() > 0.8) {
    // Attempt an unsafe modification to show guardrails blocking it
    const modResult = modifyInstance.modify({ safe: false, component: "ROOT_BOOTSTRAP" });
    agiSimulationState.lastModification = modResult;
    agiSimulationState.logs.unshift(
      `[${timestamp}] 🛡️ [Guardrails Blocked] Self-modification blocked: Exceeds default parameters.`
    );
  }

  // 6. Record this cycle into memory
  memoryInstance.remember({
    type: "AWARENESS_CYCLE",
    decision,
    result: insight.mistakes > 0 ? "warning" : "success",
    details: `Awareness epoch completed under decision action [${decision.action}].`
  });

  agiSimulationState.recentMemory = [...memoryInstance.getMemoryHistory()];

  // Log of the event
  agiSimulationState.logs.unshift(
    `[${timestamp}] 🧠 [Epoch Step ${agiSimulationState.tickCount}] Decision: ${decision.action}. Reason: "${decision.reason}"`
  );

  // Trim logs
  if (agiSimulationState.logs.length > 30) {
    agiSimulationState.logs = agiSimulationState.logs.slice(0, 30);
  }
}

// Background auto-run interval
setInterval(() => {
  if (agiSimulationState.isActive) {
    runAgiAwarenessTick();
  }
}, 20000);
