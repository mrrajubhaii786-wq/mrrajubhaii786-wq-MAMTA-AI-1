import { APIConnector } from "./APIConnector";

const api = new APIConnector();

export class TaskExecutor {
  async execute(task: string, data: any) {
    // In production we hit our internal microservices. In non-prod it simulates safely
    const baseUrl = process.env.NODE_ENV === "production" 
      ? "https://ais-dev-yknzaqypw7mjemdjq7efyi-45584871838.asia-southeast1.run.app"
      : "http://localhost:3000";

    if (task === "PAYMENT") {
      return api.call(`${baseUrl}/api/payments`, data);
    }

    if (task === "DEPLOY") {
      return api.call(`${baseUrl}/api/deploy`, data);
    }

    if (task === "NOTIFY") {
      return api.call(`${baseUrl}/api/notify`, data);
    }

    return { 
      status: "UNKNOWN_TASK",
      error: `Unsupported task type: ${task}`,
      timestamp: Date.now()
    };
  }
}
