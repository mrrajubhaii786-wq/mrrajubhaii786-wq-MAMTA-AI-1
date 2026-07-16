export class ModelRouter {
  route(complexity: number) {
    if (complexity < 3) return "CHEAP_MODEL";
    if (complexity < 7) return "MID_MODEL";

    return "HIGH_INTELLIGENCE_MODEL";
  }
}
