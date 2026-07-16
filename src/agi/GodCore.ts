import { RealityConnector } from "./RealityConnector";
import { FutureSimulator, FutureScenario } from "./FutureSimulator";
import { ScenarioEvaluator } from "./ScenarioEvaluator";
import { PredictiveDecision } from "./PredictiveDecision";
import { HumanOverride } from "./HumanOverride";
import { StateConsensus } from "./StateConsensus";

const reality = new RealityConnector();
const sim = new FutureSimulator();
const evalr = new ScenarioEvaluator();
const decide = new PredictiveDecision();
const human = new HumanOverride();
const consensus = new StateConsensus();

export interface GodModeRecord {
  timestamp: number;
  signals: any;
  futures: FutureScenario[];
  bestFuture: FutureScenario;
  proposedDecision: string;
  finalAction: string;
  humanApproved: boolean;
  nodesValid: boolean;
}

export class GodCore {
  private history: GodModeRecord[] = [];

  run(): GodModeRecord {
    // 1. Gather real-time eco telemetry
    const signals = reality.getSignals();

    // 2. Simulate 5 futures probabilistically
    const futures = sim.simulate(signals);

    // 3. Evaluate and select best future timeline
    const bestFuture = evalr.evaluate(futures);

    // 4. Formulate the predictive decision action
    const proposedDecision = decide.decide(bestFuture);

    // 5. Cross-reference multi-node state consensus validation
    const sampleNodes = [
      { name: "Node-Alpha", valid: true },
      { name: "Node-Beta", valid: true },
      { name: "Node-Sovereign", valid: true }
    ];
    const nodesValid = consensus.validate(sampleNodes);

    // 6. Human-in-the-loop override approval check
    const humanApproved = human.approve(proposedDecision);
    const finalAction = humanApproved && nodesValid ? proposedDecision : "SAFE_MODE";

    const record: GodModeRecord = {
      timestamp: Date.now(),
      signals,
      futures,
      bestFuture,
      proposedDecision,
      finalAction,
      humanApproved,
      nodesValid
    };

    this.history.push(record);
    if (this.history.length > 50) {
      this.history.shift(); // Keep bound logs
    }

    return record;
  }

  getLatestState(): GodModeRecord {
    if (this.history.length > 0) {
      return this.history[this.history.length - 1];
    }
    // Return template fallback state if history empty
    const dummySignals = reality.getSignals();
    const dummyFutures = sim.simulate(dummySignals);
    const dummyBest = evalr.evaluate(dummyFutures);
    return {
      timestamp: Date.now(),
      signals: dummySignals,
      futures: dummyFutures,
      bestFuture: dummyBest,
      proposedDecision: "OPTIMIZE",
      finalAction: "OPTIMIZE",
      humanApproved: true,
      nodesValid: true
    };
  }

  getHistory(): GodModeRecord[] {
    return this.history;
  }
}

export const godCore = new GodCore();
