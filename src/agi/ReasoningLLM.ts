export class ReasoningLLM {
  reason(input: { risk: number; growth: number; systemLoad: number }) {
    if (input.risk > 0.7 || input.systemLoad > 0.8) {
      return "AVOID";
    }
    if (input.growth > 0.6) {
      return "EXPAND";
    }
    return "STABLE";
  }
}
