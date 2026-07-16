export class PolicyAI {
  currentMode: "OPEN_MODE" | "STRICT_MODE" = "OPEN_MODE";

  decide(systemState: { risk: number }) {
    if (systemState.risk > 5) {
      this.currentMode = "STRICT_MODE";
      return "STRICT_MODE";
    }
    this.currentMode = "OPEN_MODE";
    return "OPEN_MODE";
  }

  getMode() {
    return this.currentMode;
  }
}
