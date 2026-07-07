import { Thought } from "./ThinkingEngine";

export interface Task {
  id: number;
  task: string;
  status: "pending" | "running" | "completed" | "failed";
}

export class PlannerEngine {
  createPlan(thought: Thought): Task[] {
    return thought.steps.map((step, i) => ({
      id: i,
      task: step,
      status: "pending"
    }));
  }
}
