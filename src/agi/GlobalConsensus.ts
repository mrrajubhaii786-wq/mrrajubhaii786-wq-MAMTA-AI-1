import { WeightedConsensus } from "./WeightedConsensus";

const consensus = new WeightedConsensus();

export class GlobalConsensus {
  run(nodes: any[]) {
    // Generate active votes and weights dynamically based on actual nodes
    const votes = nodes.map(node => {
      const vote = node.castVote();
      return {
        id: node.id,
        vote: vote,
        weight: node.weight
      };
    });

    const isApproved = consensus.decide(votes);
    return {
      approved: isApproved,
      votes: votes
    };
  }
}
