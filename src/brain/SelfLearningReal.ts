export interface MemoryRecord {
  input: string;
  output: any;
  time: number;
}

export class SelfLearningReal {
  private memory: MemoryRecord[] = [];

  constructor() {
    // Load existing learn cache from localStorage if running client-side
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("mamta_ai_self_learning_cache");
        if (cached) {
          this.memory = JSON.parse(cached);
          console.log(`🧠 [SelfLearningReal] Hydrated ${this.memory.length} items from persistent local storage.`);
        }
      } catch (e) {
        console.error("Failed to hydrate learning cache:", e);
      }
    }
  }

  public learn(input: string, output: any) {
    const cleanInput = input.trim().toLowerCase();
    
    // Avoid double entries for identical queries
    this.memory = this.memory.filter(m => m.input !== cleanInput);

    this.memory.push({
      input: cleanInput,
      output,
      time: Date.now()
    });

    // Keep memory size bounded to 100 items to avoid localStorage limits
    if (this.memory.length > 100) {
      this.memory.shift();
    }

    // Persist learning cache
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("mamta_ai_self_learning_cache", JSON.stringify(this.memory));
        console.log(`🎓 [SelfLearningReal] Learned new input behavior: "${cleanInput}". Saved successfully.`);
      } catch (e) {
        console.error("Failed to save learning memory:", e);
      }
    }
  }

  public recall(input: string): any | null {
    const cleanInput = input.trim().toLowerCase();
    const found = this.memory.find(m => cleanInput.includes(m.input) || m.input.includes(cleanInput));
    
    if (found) {
      console.log(`🎯 [SelfLearningReal] Memory Match Found! Recalling optimized output for query: "${cleanInput}"`);
      return found.output;
    }
    
    return null;
  }

  public clearMemory() {
    this.memory = [];
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("mamta_ai_self_learning_cache");
      } catch (e) {
        console.error("Failed to clear memory cache:", e);
      }
    }
  }

  public getMemoryCount(): number {
    return this.memory.length;
  }
}
