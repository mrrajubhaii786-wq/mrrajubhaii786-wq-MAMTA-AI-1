export class WeightedConsensus {
  decide(nodes: any[]) {
    const totalWeight = nodes.reduce((sum, n) => sum + n.weight, 0);
    const yesWeight = nodes
      .filter(n => n.vote === "YES")
      .reduce((sum, n) => sum + n.weight, 0);

    if (totalWeight === 0) return false;
    return yesWeight > totalWeight / 2;
  }
}
