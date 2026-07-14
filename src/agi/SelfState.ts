export interface SelfStateMetrics {
  health: number;
  confidence: number;
  stability: "STABLE" | "DEGRADED" | "CRITICAL";
  cognitiveLoad: number;
  safetyScore: number;
}

export class SelfState {
  private state: SelfStateMetrics = {
    health: 100,
    confidence: 0.85,
    stability: "STABLE",
    cognitiveLoad: 12, // percentage of processing power
    safetyScore: 98.8
  };

  update(result: { success: boolean }) {
    if (!result.success) {
      this.state.health = Math.max(20, this.state.health - 10);
      this.state.confidence = Math.max(0.1, this.state.confidence - 0.15);
      this.state.cognitiveLoad = Math.min(100, this.state.cognitiveLoad + 15);
      this.state.safetyScore = Math.max(50, this.state.safetyScore - 5);
    } else {
      this.state.health = Math.min(100, this.state.health + 5);
      this.state.confidence = Math.min(1.0, this.state.confidence + 0.05);
      this.state.cognitiveLoad = Math.max(5, this.state.cognitiveLoad - 2);
      this.state.safetyScore = Math.min(100, this.state.safetyScore + 0.5);
    }

    if (this.state.health > 80 && this.state.safetyScore > 90) {
      this.state.stability = "STABLE";
    } else if (this.state.health > 40) {
      this.state.stability = "DEGRADED";
    } else {
      this.state.stability = "CRITICAL";
    }

    return this.state;
  }

  getState(): SelfStateMetrics {
    return this.state;
  }
}
