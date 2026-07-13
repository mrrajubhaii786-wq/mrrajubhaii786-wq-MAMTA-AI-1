export interface MemoryEvent {
  id: string;
  type: string;
  decision?: {
    action: string;
    reason: string;
  };
  result: string;
  time: number;
  details?: string;
}

export class SelfMemory {
  private memory: MemoryEvent[] = [];

  remember(event: Omit<MemoryEvent, "id" | "time">) {
    const memoryRecord: MemoryEvent = {
      ...event,
      id: `mem_${Math.random().toString(36).substr(2, 9)}`,
      time: Date.now()
    };
    this.memory.push(memoryRecord);
    
    // Maintain a clean buffer of the last 100 memory items
    if (this.memory.length > 100) {
      this.memory.shift();
    }
  }

  recall(limit = 10): MemoryEvent[] {
    return this.memory.slice(-limit);
  }

  getMemoryHistory(): MemoryEvent[] {
    return this.memory;
  }
}
