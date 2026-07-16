import { CoreState } from "./CoreState";
import { UnifiedThinking } from "./UnifiedThinking";
import { UnifiedDecision } from "./UnifiedDecision";
import { UnifiedExecution } from "./UnifiedExecution";
import { ConsensusEngine } from "./ConsensusEngine";
import { OracleStream } from "./OracleStream";
import { HSMAuth } from "./HSMAuth";
import { VisualTestAI } from "./VisualTestAI";

export interface UnifiedCycleOutput {
  timestamp: number;
  signals: any;
  thought: "STABILIZE" | "OPTIMIZE" | "EXPAND";
  vote: {
    votes: any[];
    approved: boolean;
    consensusRate: number;
  };
  decision: "HOLD" | "SAFE_MODE" | "TUNE_SYSTEM" | "EXPAND_SYSTEM";
  result: any;
  visualTest: any;
  hsmStatus: any;
  stateSnapshot: any;
}

export class UnifiedCore {
  public state = new CoreState();
  private thinking = new UnifiedThinking();
  private decision = new UnifiedDecision();
  private execution = new UnifiedExecution();
  private consensus = new ConsensusEngine();
  private oracle = new OracleStream();
  private hsm = new HSMAuth();
  private visualTest = new VisualTestAI();

  async runCycle(input: { error: number; growth: number; authSignature?: string }): Promise<UnifiedCycleOutput> {
    // 1. Gather dynamic feeds from global oracle
    const signals = await this.oracle.stream();

    // 2. Execute reasoning pipeline
    const thought = this.thinking.process({
      error: input.error,
      growth: input.growth,
      trend: signals.trend
    });

    // 3. Trigger decentralized Paxos/Raft-ready node consensus vote
    const vote = this.consensus.vote(["ConsensusNode_Alpha", "ConsensusNode_Beta", "ConsensusNode_Gamma"]);

    // 4. Resolve final decision strategy
    const finalDecision = this.decision.decide(thought, vote.approved);

    // 5. Fire Unified Execution instructions
    const result = this.execution.execute(finalDecision);

    // 6. Run automated visual layout regression checks (UITestAI.ts)
    const visualCheck = this.visualTest.run();

    // 7. Verify physical hardware token handshake overrides
    const hsmVerification = this.hsm.verify(input.authSignature || "HARDWARE_KEY");

    // 8. Commit state and memories
    this.state.update({
      health: Math.max(10, Math.min(100, Math.round(100 - (input.error * 12)))),
      lastDecision: finalDecision,
      lastResult: result
    });

    this.state.addMemoryItem(
      `Analyzed trend: ${signals.trend}. Thought strategy: ${thought}.`,
      finalDecision,
      result.status
    );

    return {
      timestamp: Date.now(),
      signals,
      thought,
      vote,
      decision: finalDecision,
      result,
      visualTest: visualCheck,
      hsmStatus: {
        verified: hsmVerification.verified,
        securityLevel: hsmVerification.securityLevel,
        hsmMeta: this.hsm.getHSMStatus()
      },
      stateSnapshot: this.state.get()
    };
  }

  getDiagnosticState() {
    return this.state.get();
  }
}

export const unifiedCoreInstance = new UnifiedCore();
