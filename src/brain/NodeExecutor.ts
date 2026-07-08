export class NodeExecutor {
  async run(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        if (typeof process !== "undefined" && process.versions && process.versions.node) {
          // Dynamic require to prevent browser-side compilation/bundler crash
          const { exec } = require("child_process");
          exec(command, (error: any, stdout: string, stderr: string) => {
            if (error) {
              return reject(stderr || error.message);
            }
            resolve(stdout);
          });
        } else {
          // Simulated runner for the browser presentation
          console.log(`💻 [Virtual Executor] Simulating shell execution of: "${command}"`);
          setTimeout(() => {
            resolve(`✔ Node.js production server started\n✔ command "npm run dev" executed successfully on port 3000\n✔ process listening at http://localhost:3000`);
          }, 800);
        }
      } catch (e: any) {
        reject(e.message);
      }
    });
  }

  async runProject(): Promise<string> {
    return await this.run("npm run dev");
  }
}
