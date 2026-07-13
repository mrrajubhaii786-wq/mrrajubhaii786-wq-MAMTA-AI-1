// src/system/DLQWorker.ts
import { deadQueue, aiQueue } from "./QueueManager";
import { AGIEngine } from "../brain/AGIEngine";
import { rollback } from "./VersionControl";
import { SagaRollback } from "./SagaRollback";

const agi = new AGIEngine();
const saga = new SagaRollback();

deadQueue.process(async (job) => {
  console.log("🧠 [DLQWorker] AGI analyzing failed job...");
  console.log("⚠️ Rolling back system to previous safe version...");

  const error = job.data.error || "Unknown Error";
  // Support both job.data.job.data and job.data.data from the DLQ payload
  const originalJob = job.data.job?.data || job.data.data || {};

  // 🧪 Revert system state to the last known safe version
  const previousState = rollback();
  let sagaResult = "No previous state";
  if (previousState) {
    console.log("🧠 [DLQWorker] System successfully reverted to previous stable state version:", previousState);
    sagaResult = await saga.rollbackAll(previousState);
    console.log("🔄 [DLQWorker] Saga Rollback outcome:", sagaResult);
  } else {
    console.warn("⚠️ [DLQWorker] No previous version found to roll back to.");
  }

  try {
    // 🔥 AI decision
    const fixPlan = await agi.decide({
      input: error,
      context: originalJob,
    });

    console.log("🔧 [DLQWorker] AGI Auto-Correction Plan determined:", fixPlan);

    // 🔁 Retry with fix plan metadata added
    await aiQueue.add({
      ...originalJob,
      lastFixPlan: fixPlan,
      requeuedFromDLQ: true,
      requeuedAt: Date.now(),
      rolledBackState: previousState
    }, {
      attempts: 3,
    });

    return { status: "fixed and re-queued", fixPlan, previousState };
  } catch (err: any) {
    console.error("❌ [DLQWorker] Failed to auto-heal failed job:", err.message);
    throw err;
  }
});
