export interface OracleData {
  market: "BULL" | "BEAR" | "STABLE";
  infra: "HEALTHY" | "DEGRADED" | "CRITICAL";
  load: number;
  timestamp: number;
  cloud: "STABLE" | "DEGRADED" | "CRITICAL";
  latency: number;
}

export class GlobalOracle {
  async fetch(): Promise<OracleData> {
    const marketOptions: ("BULL" | "BEAR" | "STABLE")[] = ["BULL", "BEAR", "STABLE"];
    const infraOptions: ("HEALTHY" | "DEGRADED" | "CRITICAL")[] = ["HEALTHY", "DEGRADED", "CRITICAL"];

    const market = marketOptions[Math.floor(Math.random() * marketOptions.length)];
    const infra = infraOptions[Math.floor(Math.random() * 5) === 0 ? 1 : 0];

    return {
      market,
      infra,
      load: parseFloat((0.15 + Math.random() * 0.55).toFixed(3)),
      timestamp: Date.now(),
      cloud: infra === "HEALTHY" ? "STABLE" : (infra === "DEGRADED" ? "DEGRADED" : "CRITICAL"),
      latency: parseFloat((10 + Math.random() * 90).toFixed(2))
    };
  }
}
