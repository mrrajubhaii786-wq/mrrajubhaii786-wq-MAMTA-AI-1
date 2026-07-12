import { dispatchTask } from "../system/JobRouter";

/**
 * Triggers a full automated compilation, healing, and deployment cycle of Mamta AI.
 */
export async function runAICycle() {
  console.log("🧠 [TaskScheduler] Initiating Mamta AI Master Cycle...");

  try {
    // Dispatch jobs into the distributed Bull Queue
    const buildJob = await dispatchTask("BUILD", { initiatedAt: Date.now() });
    const fixJob = await dispatchTask("FIX", { targetFiles: ["server.ts", "package.json"] });
    const deployJob = await dispatchTask("DEPLOY", { env: "production" });

    console.log("🚀 [TaskScheduler] All AI Cycle jobs successfully registered to distributed swarm.");
    return {
      success: true,
      jobs: {
        buildJobId: buildJob.id,
        fixJobId: fixJob.id,
        deployJobId: deployJob.id,
      }
    };
  } catch (err: any) {
    console.error("❌ [TaskScheduler] AI Cycle trigger failed:", err.message);
    return { success: false, error: err.message };
  }
}
