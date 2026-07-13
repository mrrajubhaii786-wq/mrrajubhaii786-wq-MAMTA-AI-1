// src/brain/ConsensusEngine.ts

export type Vote = "APPROVE" | "REJECT";

export class ConsensusEngine {
  /**
   * Decides if a task is approved based on simple majority voting.
   */
  public decide(votes: Vote[]): boolean {
    const approveCount = votes.filter(v => v === "APPROVE").length;
    const rejectCount = votes.filter(v => v === "REJECT").length;
    console.log(`🗳️ [ConsensusEngine] Processing votes: ${approveCount} APPROVE vs ${rejectCount} REJECT`);
    return approveCount > rejectCount;
  }
}
