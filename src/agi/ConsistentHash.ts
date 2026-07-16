export class ConsistentHash {
  nodes: string[] = [];

  addNode(node: string) {
    if (!this.nodes.includes(node)) {
      this.nodes.push(node);
    }
  }

  removeNode(node: string) {
    this.nodes = this.nodes.filter(n => n !== node);
  }

  getNode(key: string) {
    if (this.nodes.length === 0) return null;
    
    // Hash key calculation using sum of ASCII values
    const hash = key.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return this.nodes[hash % this.nodes.length];
  }
}
