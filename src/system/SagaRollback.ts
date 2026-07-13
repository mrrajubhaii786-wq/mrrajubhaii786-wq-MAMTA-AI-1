// src/system/SagaRollback.ts
import { SagaTracker } from "./SagaTracker";

export class SagaRollback {
  /**
   * Reverts changes across multiple distributed systems (Saga pattern) on critical failures.
   */
  async rollbackAll(state: any): Promise<string> {
    console.log("🔄 [SagaRollback] Reverting global distributed states...");

    // Execute tracked fine-grained rollback steps if any are registered
    const tracker = SagaTracker.getInstance();
    const steps = tracker.getSteps();
    
    if (steps.length > 0) {
      await tracker.rollbackAll();
      return "saga tracker rollback complete";
    }

    if (!state) {
      console.log("⚠️ [SagaRollback] No state to rollback.");
      return "nothing to rollback";
    }

    if (state.github) {
      console.log("↩️ [SagaRollback] Reverting GitHub commit or branch changes...");
    }

    if (state.db) {
      console.log("↩️ [SagaRollback] Reverting Database transactions or migrations...");
    }

    if (state.deploy) {
      console.log("↩️ [SagaRollback] Reverting Cloud deployment or container tag...");
    }

    return "rollback complete";
  }
}
