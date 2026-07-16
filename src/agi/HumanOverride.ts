export class HumanOverride {
  private allowedActions: Set<string> = new Set(["SAFE_MODE", "OPTIMIZE", "EXPAND", "STABLE", "CONSOLIDATE"]);

  approve(action: string) {
    if (action === "HIGH_RISK" || action === "DESTRUCTIVE" || action === "AVOID") {
      return false; // Blocks unsafe / extremely risky operations without manual override
    }
    return this.allowedActions.has(action);
  }
}
