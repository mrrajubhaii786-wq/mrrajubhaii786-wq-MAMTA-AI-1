// src/brain/AGILoop.ts
import { aiQueue } from "../system/QueueManager";

/**
 * Starts a continuous background loop that dispatches "self-improve" tasks to the AGI.
 */
export async function startAGILoop(): Promise<void> {
  console.log("🧠 [AGILoop] Starting Continuous AGI Evolution Loop...");

  setInterval(async () => {
    try {
      // Safety guard: check queue length to prevent runaway memory leak
      const waitingCount = await aiQueue.getWaitingCount();
      if (waitingCount > 10) {
        console.log(`🧠 [AGILoop] Queue congestion detected (${waitingCount} tasks waiting). Skipping this evolution tick.`);
        return;
      }

      console.log("🧠 [AGILoop] AGI evolving...");
      await aiQueue.add({
        task: "self-improve",
        timestamp: Date.now()
      });
    } catch (err: any) {
      console.warn("⚠️ [AGILoop] Failed to dispatch self-improvement task:", err.message);
    }
  }, 10000);
}
