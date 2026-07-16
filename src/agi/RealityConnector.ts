export class RealityConnector {
  getSignals() {
    return {
      users: Math.floor(Math.random() * 100) + 1500, // Anchored near active population
      economy: Math.floor(Math.random() * 15000) + 120000, // Total assets anchor
      systemLoad: Number((Math.random() * 0.4 + 0.1).toFixed(3)), // System load anchor
      timestamp: Date.now()
    };
  }
}
