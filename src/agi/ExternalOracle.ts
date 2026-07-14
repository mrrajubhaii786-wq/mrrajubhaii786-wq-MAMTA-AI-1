export class ExternalOracle {
  async getSignals() {
    const systemLoad = 0.2 + Math.random() * 0.55; // Simulated realistic CPU / node load percentage
    const trends = ["GROWTH", "STABLE", "CONGESTION", "OPTIMAL"];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    const externalPing = 12 + Math.floor(Math.random() * 45); // ms latency

    return {
      systemLoad,
      trend,
      externalPing,
      timestamp: Date.now()
    };
  }
}
