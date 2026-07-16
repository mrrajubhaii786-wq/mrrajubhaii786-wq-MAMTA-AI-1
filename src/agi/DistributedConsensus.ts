export interface VoteRecord {
  vote: "YES" | "NO";
  nodeId?: string;
  latency?: number;
}

export class DistributedConsensus {
  decide(votes: VoteRecord[]): boolean {
    if (!votes || votes.length === 0) return false;
    const approvals = votes.filter(v => v.vote === "YES").length;
    return approvals > votes.length / 2;
  }
}
