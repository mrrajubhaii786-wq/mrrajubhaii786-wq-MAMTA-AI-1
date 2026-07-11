export async function runCommand(cmd: string): Promise<{ success: boolean; output?: string; error?: string }> {
  if (typeof process !== "undefined" && process.versions && process.versions.node) {
    return new Promise((resolve) => {
      try {
        const { exec } = require("child_process");
        exec(cmd, { timeout: 30000 }, (err: any, stdout: string, stderr: string) => {
          if (err) {
            console.log("❌ ERROR:", stderr || err.message);
            resolve({ success: false, error: stderr || err.message });
          } else {
            console.log("✅ OUTPUT:", stdout);
            resolve({ success: true, output: stdout });
          }
        });
      } catch (e: any) {
        resolve({ success: false, error: e.message });
      }
    });
  } else {
    // Client-side fetch call to server to run real commands
    try {
      const response = await fetch('/api/autonomous/run-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cmd })
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        return { success: false, error: data.error || data.stderr || "Command execution failed" };
      }
      return { success: true, output: data.stdout };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}

export class ExecutionEngine {
  async execute(action: string, data: any): Promise<string> {
    if (action === "EXECUTE_BUILD") {
      const res = await runCommand("npm run build");
      return res.success ? `✅ Build succeeded:\n${res.output}` : `❌ Build failed:\n${res.error}`;
    }
    return `No simulated action. Executing cmd: ${action}`;
  }
}
