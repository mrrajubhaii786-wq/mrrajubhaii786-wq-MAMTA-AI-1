export interface VoteResult {
  node: string;
  vote: boolean;
  latency: number;
}

export class ConsensusEngine {
  vote(nodes: string[]): { votes: VoteResult[]; approved: boolean; consensusRate: number } {
    const votes: VoteResult[] = nodes.map(node => {
      // 80% chance of positive vote to ensure reliability, with varied latencies
      const vote = Math.random() > 0.2;
      const latency = Math.floor(Math.random() * 45) + 5; // 5ms - 50ms
      return { node, vote, latency };
    });

    const yesVotes = votes.filter(v => v.vote).length;
    const approved = yesVotes > nodes.length / 2;
    const consensusRate = Number((yesVotes / nodes.length).toFixed(2));

    return {
      votes,
      approved,
      consensusRate
    };
  }
}
