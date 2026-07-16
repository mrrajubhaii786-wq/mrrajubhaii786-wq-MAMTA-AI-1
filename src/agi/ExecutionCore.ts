import { TaskExecutor } from "./TaskExecutor";
import { SafeExecution } from "./SafeExecution";

const executor = new TaskExecutor();
const safe = new SafeExecution();

export class ExecutionCore {
  async run(task: string, data: any) {
    const check = safe.run(task, data);

    if (check.status !== "ALLOWED") {
      return { 
        success: false,
        status: "BLOCKED",
        reason: "Security execution guard rejected payload.",
        timestamp: Date.now()
      };
    }

    const execResult = await executor.execute(task, data);
    return {
      success: true,
      status: "EXECUTED",
      securityProof: check.proof,
      result: execResult,
      timestamp: Date.now()
    };
  }
}
