export interface VectorMemoryItem {
  input: string;
  output: string;
  vector: number[];
}

export class VectorMemory {
  public memory: VectorMemoryItem[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("mamta_ai_vector_memory_cache");
        if (cached) {
          this.memory = JSON.parse(cached);
          console.log(`🌌 [VectorMemory] Loaded ${this.memory.length} memories from local storage cache.`);
        }
      } catch (e) {
        console.error("Failed to parse vector memory cache:", e);
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("mamta_ai_vector_memory_cache", JSON.stringify(this.memory));
      } catch (e) {
        console.error("Failed to persist vector memory:", e);
      }
    }
  }

  public embed(text: string): number[] {
    const size = 100;
    const vec: number[] = new Array(size).fill(0);
    for (let i = 0; i < Math.min(text.length, size); i++) {
      vec[i] = text.charCodeAt(i) / 255;
    }
    return vec;
  }

  public similarity(a: number[], b: number[]): number {
    const len = Math.min(a.length, b.length);
    if (len === 0) return 0;
    let sum = 0;
    for (let i = 0; i < len; i++) {
      sum += a[i] * b[i];
    }
    return sum;
  }

  public store(input: string, output: string): void {
    const vector = this.embed(input);
    this.memory.push({
      input,
      output,
      vector
    });

    if (this.memory.length > 500) {
      this.memory.shift();
    }

    this.saveToStorage();
  }

  public async add(text: string, vector: number[]): Promise<void> {
    this.memory.push({
      input: text,
      output: text,
      vector
    });

    if (this.memory.length > 500) {
      this.memory.shift();
    }

    this.saveToStorage();
  }

  // Polymorphic search supporting string and vector query formats
  public search(query: string): VectorMemoryItem | null;
  public search(queryVector: number[]): Promise<string | null>;
  public search(arg: string | number[]): any {
    if (typeof arg === "string") {
      // String-based search
      if (this.memory.length === 0) return null;
      const qVec = this.embed(arg);
      let best: VectorMemoryItem | null = null;
      let bestScore = -Infinity;

      for (const item of this.memory) {
        const score = this.similarity(qVec, item.vector);
        if (score > bestScore) {
          bestScore = score;
          best = item;
        }
      }
      return bestScore > 0.05 ? best : null;
    } else {
      // Vector-based search
      if (this.memory.length === 0) return Promise.resolve(null);
      let bestMatch: VectorMemoryItem | null = null;
      let bestScore = -Infinity;

      for (const item of this.memory) {
        const score = this.similarity(arg, item.vector);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = item;
        }
      }
      return Promise.resolve(bestScore > 0.05 && bestMatch ? bestMatch.output : null);
    }
  }
}
