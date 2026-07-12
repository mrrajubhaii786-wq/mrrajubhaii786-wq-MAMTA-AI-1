// src/system/DLQWorker.ts
import { deadQueue, aiQueue } from "./QueueManager";
import { AGIEngine } from "../brain/AGIEngine";

const agi = new AGIEngine();

deadQueue.process(async (job) => {
  console.log("🧠 [DLQWorker] AGI analyzing failed job...");

  const error = job.data.error || "Unknown Error";
  // Support both job.data.job.data and job.data.data from the DLQ payload
  const originalJob = job.data.job?.data || job.data.data || {};

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
      requeuedAt: Date.now()
    }, {
      attempts: 3,
    });

    return { status: "fixed and re-queued", fixPlan };
  } catch (err: any) {
    console.error("❌ [DLQWorker] Failed to auto-heal failed job:", err.message);
    throw err;
  }
});
