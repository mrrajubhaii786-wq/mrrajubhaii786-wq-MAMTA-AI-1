export class DynamicConsensus {
  decide(nodes: any[], load: number) {
    let threshold = 0.5;

    if (load > 70) threshold = 0.6;
    if (load > 90) threshold = 0.7;

    const total = nodes.length;
    if (total === 0) return false;

    const yes = nodes.filter(n => n.vote === "YES").length;
    return yes / total > threshold;
  }
}
