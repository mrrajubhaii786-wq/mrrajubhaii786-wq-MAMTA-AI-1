// src/brain/ProjectMemory.ts

export interface MemoryState {
  files: string[];
  errors: string[];
  status: string;
  [key: string]: any;
}

export class ProjectMemory {
  private state: MemoryState = {
    files: [],
    errors: [],
    status: "idle"
  };

  update(data: Partial<MemoryState>) {
    this.state = { ...this.state, ...data };
    console.log("🧠 [ProjectMemory] Updated state:", this.state);
  }

  get(): MemoryState {
    return this.state;
  }
}
