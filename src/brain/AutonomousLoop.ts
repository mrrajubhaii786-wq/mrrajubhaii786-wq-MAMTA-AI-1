import { decide, AutonomousState } from "./DecisionEngine";
import { safeRun } from "./SafeExecution";
import { retry } from "./RetryEngine";

export class AutonomousLoop {
  private brain: any;
  private running: boolean = false;
  private paused: boolean = false;
  private subscribers: ((status: string) => void)[] = [];

  constructor(brain?: any) {
    this.brain = brain;
    this.running = false;
    this.paused = false;
  }

  public subscribe(callback: (status: string) => void) {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: (status: string) => void) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  private notify(status: string) {
    this.subscribers.forEach(sub => {
      try {
        sub(status);
      } catch (e) {
        console.error("Sub notification error:", e);
      }
    });
  }

  public pause() {
    if (this.running && !this.paused) {
      this.paused = true;
      this.notify("⏸ Autonomous Loop Paused.");
    }
  }

  public resume() {
    if (this.running && this.paused) {
      this.paused = false;
      this.notify("▶ Autonomous Loop Resumed.");
    }
  }

  public isPaused(): boolean {
    return this.paused;
  }

  public async retry(customBrain?: any) {
    this.notify("🔁 Restarting Autonomous Loop (Retry)...");
    this.stop();
    this.paused = false;
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.start(customBrain);
  }

  public async start(customBrain?: any) {
    if (this.running) return;
    this.running = true;
    this.notify("🤖 Autonomous Core Activated: Running Real Self-Correction Loop...");
    
    const activeBrain = customBrain || this.brain;
    if (!activeBrain) {
      this.notify("❌ Error: No brain connected to the loop.");
      this.running = false;
      return;
    }

    let state: AutonomousState = {
      built: false,
      deployed: false,
      error: null
    };

    let step = 1;
    const maxSteps = 15;

    while (this.running && step <= maxSteps) {
      if (this.paused) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      this.notify(`⚡ [Loop Cycle ${step}/${maxSteps}] Assessing state...`);
      console.log("⚡ LOOP CYCLE:", step);

      const decision = activeBrain.decide(state);
      this.notify(`🧠 AI Decision: "${decision.toUpperCase()}"`);

      if (decision === "build") {
        this.notify("🔨 Building system: Running production compilers ('npm run build')...");
        const res = await safeRun(async () => await retry(async () => await activeBrain.build(), 3));
        if (res && 'error' in res && res.error) {
          state.built = false;
          state.error = res.message;
          this.notify(`❌ Build failed: ${state.error}`);
        } else if (res && (res as any).success) {
          state.built = true;
          state.error = null;
          this.notify("✅ Build successful! No errors encountered.");
        } else {
          state.built = false;
          state.error = (res as any)?.error || "Build compiling mismatch";
          this.notify(`❌ Build failed: ${state.error}`);
        }
      }

      if (decision === "fix") {
        this.notify(`🛠 Self-Healing Mode: Repairing captured failure: "${state.error}"`);
        const res = await safeRun(async () => await retry(async () => await activeBrain.fix(state.error), 3));
        if (res && 'error' in res && res.error) {
          state.error = res.message;
          this.notify(`❌ Self-healing failed to repair: ${state.error}`);
        } else if (res && (res as any).success) {
          state.error = null;
          this.notify("✅ Self-healing recovery command executed successfully!");
        } else {
          state.error = (res as any)?.error || "Auto-fix failed";
          this.notify(`❌ Self-healing failed to repair: ${state.error}`);
        }
      }

      if (decision === "deploy") {
        this.notify("🚀 Deploying compiled build: Transferring assets to host platform...");
        const res = await safeRun(async () => await retry(async () => await activeBrain.deploy(), 3));
        if (res && 'error' in res && res.error) {
          state.deployed = false;
          state.error = res.message;
          this.notify(`❌ Deployment failed: ${state.error}`);
        } else if (res && (res as any).success) {
          state.deployed = true;
          this.notify(`🎉 DEPLOYMENT COMPLETE! Site fully online!`);
        } else {
          state.deployed = false;
          state.error = (res as any)?.error || "Deployment pipeline error";
          this.notify(`❌ Deployment failed: ${state.error}`);
        }
      }

      if (decision === "done" || state.deployed) {
        this.notify("🌟 MISSION COMPLETED: System is healthy and deployed!");
        break;
      }

      step++;
      // Wait 3 seconds between cycles to let subscribers read and make it visual
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    this.running = false;
    this.notify("⏹ Autonomous Loop process terminated.");
    return state;
  }

  public stop() {
    this.running = false;
    this.notify("⏹ Autonomous Loop Stopped.");
  }

  public isRunning(): boolean {
    return this.running;
  }
}
