// src/brain/ProjectBrain.ts

export class ProjectBrain {
  public state = {
    files: {} as Record<string, string>,
    errors: [] as string[],
    steps: [] as string[],
    status: "idle"
  };

  public update(data: Partial<typeof this.state>) {
    this.state = { ...this.state, ...data };
    console.log("🧠 [ProjectBrain] Updated state:", this.state);
  }

  public get() {
    return this.state;
  }
}
