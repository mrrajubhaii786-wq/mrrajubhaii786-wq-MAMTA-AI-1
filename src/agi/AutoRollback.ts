export class AutoRollback {
  private rollbackCount: number = 0;
  private lastRollbackTime: number = 0;

  monitor(result: { success: boolean; step?: string }): { status: string; triggered: boolean; action: string } {
    if (!result.success) {
      this.rollbackCount++;
      this.lastRollbackTime = Date.now();
      return {
        status: "ROLLBACK",
        triggered: true,
        action: `Reverting architectural modifications applied during: ${result.step || "unspecified step"}`
      };
    }

    return {
      status: "STABLE",
      triggered: false,
      action: "System health verified. Evolution baseline remains intact."
    };
  }

  getStats() {
    return {
      rollbackCount: this.rollbackCount,
      lastRollbackTime: this.lastRollbackTime
    };
  }
}
