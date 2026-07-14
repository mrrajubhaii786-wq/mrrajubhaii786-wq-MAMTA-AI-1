export interface OracleData {
  market: "BULL" | "BEAR" | "STABLE";
  infra: "HEALTHY" | "DEGRADED" | "CRITICAL";
  load: number;
  timestamp: number;
}

export class GlobalOracle {
  async fetch(): Promise<OracleData> {
    const marketOptions: ("BULL" | "BEAR" | "STABLE")[] = ["BULL", "BEAR", "STABLE"];
    const infraOptions: ("HEALTHY" | "DEGRADED" | "CRITICAL")[] = ["HEALTHY", "DEGRADED", "CRITICAL"];

    // Return realistic mocked dynamic state representing real-time external oracle telemetry
    return {
      market: marketOptions[Math.floor(Math.random() * marketOptions.length)],
      infra: infraOptions[Math.floor(Math.random() * 5) === 0 ? 1 : 0], // Mostly healthy
      load: parseFloat((0.15 + Math.random() * 0.55).toFixed(3)),
      timestamp: Date.now()
    };
  }
}
