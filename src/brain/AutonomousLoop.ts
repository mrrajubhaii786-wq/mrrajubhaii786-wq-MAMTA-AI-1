export class AutonomousLoop {
  private brain: any;
  private running: boolean = false;
  private intervalId: any = null;
  private subscribers: ((status: string) => void)[] = [];

  constructor(brain: any) {
    this.brain = brain;
    this.running = false;
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

  public start() {
    if (this.running) return;
    this.running = true;
    this.notify("Autonomous Loop Started");

    // Run first loop iteration immediately
    this.executeLoopIteration();

    // Setup periodic task loop every 15 seconds for lightweight dashboard activity
    this.intervalId = setInterval(() => {
      if (this.running) {
        this.executeLoopIteration();
      }
    }, 15000);
  }

  private async executeLoopIteration() {
    this.notify("Autonomous: Thinking next goals...");
    try {
      const response = await this.brain.autoThink();
      this.notify(`Completed: ${response.substring(0, 50)}...`);
    } catch (e) {
      this.notify("Autonomous: Idle / Standby");
    }
  }

  public stop() {
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.notify("Autonomous Loop Stopped");
  }

  public isRunning(): boolean {
    return this.running;
  }
}
