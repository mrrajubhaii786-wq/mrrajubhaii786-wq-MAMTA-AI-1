export interface MemoryRecord {
  model: {
    strategy: number;
    risk: number;
    behavior: string;
  };
  score: number;
  timestamp: string;
  worldName: string;
}

export class SharedMemory {
  memory: MemoryRecord[] = [];

  save(data: MemoryRecord) {
    this.memory.push(data);
    // Limit to last 50 entries
    if (this.memory.length > 50) {
      this.memory.shift();
    }
  }

  getBest(): MemoryRecord | undefined {
    if (this.memory.length === 0) return undefined;
    return [...this.memory].sort((a, b) => b.score - a.score)[0];
  }

  getHistory(): MemoryRecord[] {
    return this.memory;
  }
}
