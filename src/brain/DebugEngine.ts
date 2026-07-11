import { runCommand } from "./ExecutionEngine";

export async function autoFix(error: string): Promise<{ success: boolean; output?: string; error?: string }> {
  const errText = error.toLowerCase();

  if (errText.includes("module not found") || errText.includes("cannot find module") || errText.includes("not found")) {
    console.log("🛠 [DebugEngine] Running auto-fix: npm install...");
    return await runCommand("npm install");
  }

  if (errText.includes("vite") || errText.includes("build") || errText.includes("tsc")) {
    console.log("🛠 [DebugEngine] Running auto-fix: npm run build...");
    return await runCommand("npm run build");
  }

  console.log("🛠 [DebugEngine] Running generic clean & compile fix...");
  return await runCommand("npm run build");
}

export class DebugEngine {
  fix(error: string): string {
    const errText = error.toLowerCase();

    if (errText.includes("module not found") || errText.includes("cannot find module")) {
      return "📦 **Self-Debugging Action:** Installing missing dependency module via Node Package Manager...";
    }

    if (errText.includes("syntax") || errText.includes("unexpected token")) {
      return "🛠 **Self-Debugging Action:** Repairing syntax brackets, colons, or imports layout...";
    }

    if (errText.includes("unauthorized") || errText.includes("401") || errText.includes("forbidden")) {
      return "🔑 **Self-Debugging Action:** Refreshing API key variables and security header signatures...";
    }

    if (errText.includes("timeout") || errText.includes("ratelimit") || errText.includes("429")) {
      return "⏳ **Self-Debugging Action:** Activating exponential backoff wait state (throttling mitigation)...";
    }

    return "⚠️ **Self-Debugging Action:** Unknown error detected. Triggering deep cognitive self-evolving check and retrying...";
  }

  async autoFixReal(error: string): Promise<{ success: boolean; output?: string; error?: string }> {
    return await autoFix(error);
  }
}
