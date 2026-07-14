export interface GraphEdge {
  from: string;
  to: string;
}

export class CognitiveGraph {
  private nodes: GraphEdge[] = [];

  constructor() {
    // Bootstrap initial cognitive nodes mapping AGI goals
    this.connect("IDENTITY_ENGINE", "SELF_MEMORY");
    this.connect("SELF_MEMORY", "REFLECTION_ENGINE");
    this.connect("REFLECTION_ENGINE", "DECISION_REASONING");
    this.connect("DECISION_REASONING", "WILL_ENGINE");
  }

  connect(a: string, b: string) {
    if (!this.nodes.some(edge => edge.from === a && edge.to === b)) {
      this.nodes.push({ from: a, to: b });
    }
  }

  getGraph(): GraphEdge[] {
    return this.nodes;
  }
}
