export class ConsensusAI {
  vote(decisions: string[]): string {
    const count: Record<string, number> = {};

    decisions.forEach(d => {
      count[d] = (count[d] || 0) + 1;
    });

    return Object.keys(count).reduce((a, b) =>
      count[a] > count[b] ? a : b
    );
  }
}
