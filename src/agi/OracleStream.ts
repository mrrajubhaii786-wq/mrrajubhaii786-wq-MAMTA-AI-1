export interface OracleSignals {
  market: "BULL" | "BEAR" | "STABLE";
  infra: "HEALTHY" | "DEGRADED" | "CRITICAL";
  trend: "AI_BOOM" | "CONVERGENCE_HYPED" | "STABILIZATION_PHASE";
  load: number;
  timestamp: number;
}

export class OracleStream {
  async stream(): Promise<OracleSignals> {
    const markets: Array<"BULL" | "BEAR" | "STABLE"> = ["BULL", "STABLE", "STABLE"];
    const infras: Array<"HEALTHY" | "DEGRADED"> = ["HEALTHY", "HEALTHY", "DEGRADED"];
    const trends: Array<"AI_BOOM" | "CONVERGENCE_HYPED" | "STABILIZATION_PHASE"> = [
      "AI_BOOM",
      "CONVERGENCE_HYPED",
      "STABILIZATION_PHASE"
    ];

    const randomMarket = markets[Math.floor(Math.random() * markets.length)];
    const randomInfra = infras[Math.floor(Math.random() * infras.length)];
    const randomTrend = trends[Math.floor(Math.random() * trends.length)];
    const randomLoad = Number((0.15 + Math.random() * 0.4).toFixed(3)); // 15% to 55%

    return {
      market: randomMarket,
      infra: randomInfra,
      trend: randomTrend,
      load: randomLoad,
      timestamp: Date.now()
    };
  }
}
