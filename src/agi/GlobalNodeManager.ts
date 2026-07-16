import { GeoNode } from "./GeoNode";

export class GlobalNodeManager {
  nodes: GeoNode[] = [];

  constructor() {
    // We can initialize default world nodes
  }

  createNode(id: string, region: string, coords?: [number, number], ip?: string) {
    const finalCoords: [number, number] = coords || [
      37.0902 + (Math.random() - 0.5) * 10,
      -95.7129 + (Math.random() - 0.5) * 10
    ];
    const finalIp = ip || `192.168.${Math.floor(1 + Math.random() * 254)}.${Math.floor(Math.random() * 254)}`;
    
    const node = new GeoNode(id, region, finalCoords, finalIp);
    this.nodes.push(node);
  }

  getNodes() {
    return this.nodes;
  }

  removeNode(id: string) {
    this.nodes = this.nodes.filter(n => n.id !== id);
  }
}
