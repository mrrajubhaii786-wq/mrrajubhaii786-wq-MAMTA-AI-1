export class NodeHealth {
  check(nodes: { id: string }[]) {
    return nodes.map(node => ({
      id: node.id,
      alive: Math.random() > 0.15 // 85% survival rate, creating a realistic distributed network failure simulation
    }));
  }
}
