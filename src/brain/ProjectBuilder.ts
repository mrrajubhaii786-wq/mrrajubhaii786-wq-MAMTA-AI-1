import { TaskPlanner } from "./TaskPlanner";
import { AgentManagerV2 } from "./AgentManagerV2";
import { FileSystemEngine } from "./FileSystemEngine";
import { GitHubEngine } from "./GitHubEngine";

export class ProjectBuilder {
  public planner = new TaskPlanner();
  public agents = new AgentManagerV2();
  public fs = new FileSystemEngine();
  public github = new GitHubEngine();

  async buildProject(input: string): Promise<{ message: string; files: any[]; github: string }> {
    const cleanInput = input.replace(/build project/gi, "").trim() || "Autonomous App";

    // Step 1: Create structured tasks from input specifications
    const tasks = this.planner.createTasks(cleanInput);

    // Step 2: Run builder agents to assemble clean TS/React blueprints
    const results = await this.agents.run(tasks);

    // Step 3: Write out outputs to the safe File System Engine (virtual and safe-native)
    for (const res of results) {
      this.fs.createFile(res.file, res.code);
    }

    // Step 4: Run production push simulation for deployment pipeline feedback
    const pushFeedback = await this.github.pushRepo(cleanInput.toLowerCase().replace(/\s+/g, "-"));

    return {
      message: `🔥 Mamta AI Level 8 OS: Built project "${cleanInput}" successfully!`,
      files: results,
      github: pushFeedback
    };
  }
}
