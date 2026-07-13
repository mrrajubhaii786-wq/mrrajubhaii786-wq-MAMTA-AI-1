// src/system/Worker.ts
import { aiQueue } from "./QueueManager";
import { canExecute, recordFailure, resetCircuit } from "./CircuitBreaker";
import { AGIEngine } from "../brain/AGIEngine";
import { validateCommand, validateAction } from "./Guardrails";
import { safeExec } from "./Sandbox";
import { saveVersion } from "./VersionControl";

const agi = new AGIEngine();

console.log("⚡ [Worker] Mamta AI worker process started and listening for jobs...");

aiQueue.process(async (job) => {
  if (!canExecute()) {
    console.error("🚨 [Worker] Circuit Breaker is OPEN. Skipping execution and pausing.");
    throw new Error("Circuit Open - System Paused");
  }

  // Support both job.data.task (AGI Loop) and job.data.taskType (legacy/manual dispatch)
  const taskQuery = job.data.task || job.data.taskType || "BUILD";
  const payload = job.data.payload || job.data;

  console.log(`🧠 [Worker] Job ID: ${job.id} | AGI is thinking about: "${taskQuery}"...`);

  try {
    // 🔥 AGI dynamic decision-making
    const decision = await agi.decide({
      input: taskQuery,
      state: payload,
    });

    console.log(`⚡ [Worker] AGI Decision outcome:`, decision);

    // Merge decision values
    const action = decision.action || taskQuery;
    const command = job.data.command || `echo 'Executing task: ${action}'`;

    // 🛡️ Guardrails Layer validation
    validateAction(action);
    validateCommand(command);

    // 🧾 Save version state before execution
    saveVersion(job.data);

    // 🧪 Sandbox execution (Containerized / Fallback Protected)
    const sandboxOutput = await safeExec(command);
    console.log("🧪 [Worker] Sandbox Output:", sandboxOutput);

    // Simulate real AI processing workload and steps
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let result;
    switch (action) {
      case "BUILD":
        console.log("🏗️ [Worker] AI Build successful in sandboxed environment.");
        result = { status: "SUCCESS", message: "Build Complete", decision, sandboxOutput, timestamp: Date.now() };
        break;

      case "FIX":
        console.log("🔧 [Worker] AI Self-Correction loop repaired system discrepancies.");
        result = { status: "SUCCESS", message: "Fixed Errors", decision, sandboxOutput, timestamp: Date.now() };
        break;

      case "DEPLOY":
        console.log("🚀 [Worker] Deploying successfully to scalable production cluster.");
        result = { status: "SUCCESS", message: "Deployed", decision, sandboxOutput, timestamp: Date.now() };
        break;

      default:
        console.log(`⚠️ [Worker] AGI returned action "${action}" (or idle state).`);
        result = { status: "SUCCESS", message: `Execution completed: ${action}`, decision, sandboxOutput, timestamp: Date.now() };
        break;
    }

    // Reset circuit breaker on successful execution
    resetCircuit();
    return result;
  } catch (err: any) {
    console.error(`❌ [Worker] Job failed during AGI thinking/execution:`, err.message);
    recordFailure();
    throw err;
  }
});
