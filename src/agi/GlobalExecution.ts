import { ExecutionCore } from "./ExecutionCore";

const core = new ExecutionCore();

export class GlobalExecution {
  async process(request: any) {
    const { task, payload } = request;
    if (!task) {
      return {
        success: false,
        error: "Missing task identifier in request envelope",
        timestamp: Date.now()
      };
    }
    return await core.run(task, payload);
  }
}
