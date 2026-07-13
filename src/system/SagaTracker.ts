// src/system/SagaTracker.ts

export interface SagaStep {
  id: string;
  actionType: string;
  compensate: () => Promise<void>;
  timestamp: number;
}

export class SagaTracker {
  private static instance: SagaTracker;
  private steps: SagaStep[] = [];

  private constructor() {}

  public static getInstance(): SagaTracker {
    if (!SagaTracker.instance) {
      SagaTracker.instance = new SagaTracker();
    }
    return SagaTracker.instance;
  }

  public registerStep(id: string, actionType: string, compensate: () => Promise<void>): void {
    console.log(`📝 [SagaTracker] Registered compensation step: [${actionType}] ${id}`);
    this.steps.push({
      id,
      actionType,
      compensate,
      timestamp: Date.now(),
    });
  }

  public getSteps(): SagaStep[] {
    return [...this.steps];
  }

  public clear(): void {
    this.steps = [];
  }

  public async rollbackAll(): Promise<void> {
    console.log(`🔄 [SagaTracker] Starting full compensating execution for ${this.steps.length} steps...`);
    // Run backward (LIFO - Last In First Out)
    const reversed = [...this.steps].reverse();
    for (const step of reversed) {
      try {
        console.log(`↩️ [SagaTracker] Rolling back step: [${step.actionType}] ${step.id}`);
        await step.compensate();
        console.log(`✅ [SagaTracker] Successfully reverted: ${step.id}`);
      } catch (err: any) {
        console.error(`❌ [SagaTracker] Revert failed for step ${step.id}:`, err.message);
      }
    }
    this.clear();
  }
}
