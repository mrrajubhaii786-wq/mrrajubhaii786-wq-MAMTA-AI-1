export interface ContextData {
  marketTrend: "BULL" | "BEAR";
  systemLoad: number;
  growth: number;
  errors: number;
}

export class ExternalContext {
  getContext(existingErrors = 0): ContextData {
    return {
      marketTrend: Math.random() > 0.5 ? "BULL" : "BEAR",
      systemLoad: parseFloat((Math.random() * 100).toFixed(1)),
      growth: Math.floor(Math.random() * 100),
      errors: existingErrors
    };
  }
}
