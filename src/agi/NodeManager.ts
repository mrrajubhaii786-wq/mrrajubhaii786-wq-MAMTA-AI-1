import { Node } from "./Node";

export class NodeManager {
  nodes: Node[] = [];

  createNode(id: string): Node {
    // Avoid duplicate creation
    const existing = this.nodes.find(n => n.id === id);
    if (existing) return existing;

    const node = new Node(id);
    this.nodes.push(node);
    return node;
  }

  getNodes(): Node[] {
    return this.nodes;
  }

  removeNode(id: string) {
    this.nodes = this.nodes.filter(n => n.id !== id);
  }
}
