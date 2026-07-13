export class IntelligenceAI {
  generateModel() {
    return {
      strategy: Math.random(),
      risk: Math.random(),
      behavior: ["aggressive", "balanced", "conservative"][
        Math.floor(Math.random() * 3)
      ]
    };
  }
}
