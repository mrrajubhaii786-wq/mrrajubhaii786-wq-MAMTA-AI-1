import { NodeExecutor } from "./NodeExecutor";
import { BrowserAutomation } from "./BrowserAutomation";
import { GitHubRealAPI } from "./GitHubRealAPI";
import { DebugEngine } from "./DebugEngine";

export class ExecutionController {
  public node = new NodeExecutor();
  public browser = new BrowserAutomation();
  public github = new GitHubRealAPI();
  public debug = new DebugEngine();

  async execute(customRepo?: string, customToken?: string, customCode?: string) {
    try {
      console.log("⚙ [ExecutionController] Starting Level 9 Autonomous run-test-deploy loop...");

      const runOutput = await this.node.runProject();
      const testOutput = await this.browser.testSite("http://localhost:3000");
      const pushOutput = await this.github.push(
        customToken || "",
        customRepo || "mamta-ai/autonomous-workspace",
        customCode || "console.log('Mamta AI Level 9 Complete');"
      );

      return {
        success: true,
        run: runOutput,
        test: testOutput,
        push: pushOutput
      };
    } catch (err: any) {
      console.error("⚠️ [ExecutionController] Fault detected in deployment pipeline. Activating DebugEngine...", err);
      const fixSolution = this.debug.fix(err.message || String(err));
      return {
        success: false,
        error: err.message || String(err),
        solution: fixSolution
      };
    }
  }
}
