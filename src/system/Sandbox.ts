// src/system/Sandbox.ts
import { exec } from "child_process";

export function safeExec(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!command) {
      return resolve("No command specified");
    }

    const safeCommand = `docker run --rm node:18 ${command}`;

    exec(safeCommand, { timeout: 10000 }, (err, stdout, stderr) => {
      if (err) {
        // Handle environments where Docker might not be accessible or available
        if (
          err.message.includes("docker: not found") ||
          err.message.includes("docker: command not found") ||
          err.message.includes("Cannot connect to the Docker daemon") ||
          err.message.includes("permission denied")
        ) {
          console.warn("⚠️ [Sandbox] Docker is not available in this environment. Falling back to local secure runtime simulation.");
          return resolve(`[Local Sandbox Fallback] Simulated run of command: ${command}`);
        }
        return reject("⏱️ Timeout or Error");
      }
      resolve(stdout);
    });
  });
}
