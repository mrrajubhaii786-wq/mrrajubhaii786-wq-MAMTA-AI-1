import { GlobalConsciousness } from "./GlobalConsciousness";
import { UniversalThinking } from "./UniversalThinking";
import { UniversalDecision } from "./UniversalDecision";
import { UniversalExecution } from "./UniversalExecution";
import { PolicyLLM } from "./PolicyLLM";
import { MerkleState } from "./MerkleState";

const brain = new GlobalConsciousness();
const think = new UniversalThinking();
const decide = new UniversalDecision();
const exec = new UniversalExecution();
const policy = new PolicyLLM();
const merkle = new MerkleState();

export class UniversalCore {
  private history: Array<{
    timestamp: number;
    merged: any;
    thought: string;
    decision: string;
    execution: any;
    policyMode: string;
    merkleRoot: string;
  }> = [];

  run(layers: any[]) {
    // 1. Merge all layers (Human, Economy, Civilization, Network)
    const merged = brain.merge(layers);

    // 2. Perform global thinking analysis
    const thought = think.analyze(merged);

    // 3. Make global consensus decision
    const decision = decide.decide([thought]);

    // 4. Generate policy mode
    const policyMode = policy.generate(JSON.stringify(merged));

    // 5. Execute unified decision
    const execution = exec.run(decision);

    // 6. Generate Merkle integrity hash
    const merkleRoot = merkle.hash(JSON.stringify({ merged, thought, decision, policyMode }));

    const record = {
      timestamp: Date.now(),
      merged,
      thought,
      decision,
      execution,
      policyMode,
      merkleRoot
    };

    this.history.push(record);
    if (this.history.length > 50) {
      this.history.shift(); // Keep logs constrained
    }

    return record;
  }

  getLatestState() {
    return this.history[this.history.length - 1] || {
      timestamp: Date.now(),
      merged: {},
      thought: "IDLE",
      decision: "IDLE",
      execution: { action: "IDLE", status: "WAITING" },
      policyMode: "ADAPTIVE_POLICY",
      merkleRoot: "0000000000000000000000000000000000000000000000000000000000000000"
    };
  }

  getHistory() {
    return this.history;
  }
}

export const universalCore = new UniversalCore();
