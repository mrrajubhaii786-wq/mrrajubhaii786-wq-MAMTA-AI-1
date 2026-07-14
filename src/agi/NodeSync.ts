export interface SyncStatus {
  node: string;
  status: "SYNCED" | "OUT_OF_SYNC" | "CONNECTING";
  latency: number;
}

export class NodeSync {
  sync(nodes: string[]): SyncStatus[] {
    const activeNodes = nodes.length > 0 ? nodes : ["NODE_ASIA_01", "NODE_AMER_02", "NODE_EURO_03"];
    return activeNodes.map((n, i) => ({
      node: n,
      status: "SYNCED",
      latency: 10 + i * 8 + Math.round(Math.random() * 5)
    }));
  }
}
