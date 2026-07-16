export class EcoRegistry {
  systems = new Map<string, any>();

  constructor() {
    // Register initial default AGI subsystems
    this.register("LedgerCore", { type: "financial", status: "HEALTHY" });
    this.register("ByzantineConsensus", { type: "security", status: "HEALTHY" });
    this.register("SovereignEdgeCluster", { type: "infrastructure", status: "HEALTHY" });
  }

  register(name: string, system: any) {
    this.systems.set(name, system);
  }

  getAll() {
    return Array.from(this.systems.keys());
  }

  getDetails() {
    const details: any = {};
    this.systems.forEach((val, key) => {
      details[key] = val;
    });
    return details;
  }
}
