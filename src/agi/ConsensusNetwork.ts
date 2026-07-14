export class ConsensusNetwork {
  nodes = ["node-mainframe", "node-sentinel-2", "node-guard-3"];

  vote(planStep: string): { success: boolean; voteDetails: { node: string; approved: boolean }[] } {
    const voteDetails = this.nodes.map(node => {
      // High weight on stable growth or explore steps, randomized but grounded
      const approved = Math.random() > 0.25; 
      return { node, approved };
    });

    const yesVotes = voteDetails.filter(v => v.approved).length;
    const isApproved = yesVotes >= 2; // Simple majority quorum

    return {
      success: isApproved,
      voteDetails
    };
  }
}
