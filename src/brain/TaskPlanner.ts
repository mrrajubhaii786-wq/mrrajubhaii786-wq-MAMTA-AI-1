export interface Task {
  id: number;
  title: string;
  status: "pending" | "completed";
}

export class TaskPlanner {
  createTasks(input: string): Task[] {
    const topic = input.replace(/build project/gi, "").trim() || "Autonomous App";
    return [
      { id: 1, title: `Analyze project specifications for: "${topic}"`, status: "completed" },
      { id: 2, title: `Design modular reactive state architecture`, status: "completed" },
      { id: 3, title: `Create virtual code structure and components`, status: "completed" },
      { id: 4, title: `Write fully optimized TypeScript code logic`, status: "completed" },
      { id: 5, title: `Verify build correctness and run security audits`, status: "completed" }
    ];
  }
}
