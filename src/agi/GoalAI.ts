export interface GoalItem {
  id: string;
  goal: string;
  progress: number;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
}

export class GoalAI {
  private goals: GoalItem[] = [];

  constructor() {
    // Add default core objectives
    this.setGoal("Establish Quantum Multiverse Lattice Sync");
    this.setGoal("Attain Self-Reflecting Autonomous Decision State");
    this.setGoal("Minimize Sandbox Failure Rate to < 1%");
  }

  setGoal(goal: string): GoalItem {
    const newItem: GoalItem = {
      id: `goal_${Math.random().toString(36).substr(2, 9)}`,
      goal,
      progress: 0,
      status: "ACTIVE"
    };
    this.goals.push(newItem);
    return newItem;
  }

  updateProgress(index: number, value: number) {
    if (this.goals[index]) {
      this.goals[index].progress = Math.min(100, Math.max(0, this.goals[index].progress + value));
      if (this.goals[index].progress >= 100) {
        this.goals[index].status = "COMPLETED";
      }
    }
  }

  getGoals(): GoalItem[] {
    return this.goals;
  }
}
