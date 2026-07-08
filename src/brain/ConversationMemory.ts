export interface MemoryMessage {
  role: "user" | "ai";
  text: string;
  time: number;
}

export class ConversationMemory {
  private history: MemoryMessage[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("mamta_chat_history_v11");
        if (stored) {
          this.history = JSON.parse(stored);
        }
      } catch (e) {
        console.warn("[ConversationMemory] Failed to load chat history from localStorage:", e);
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("mamta_chat_history_v11", JSON.stringify(this.history));
      } catch (e) {
        console.warn("[ConversationMemory] Failed to save chat history to localStorage:", e);
      }
    }
  }

  add(role: "user" | "ai", text: string) {
    this.history.push({
      role,
      text,
      time: Date.now()
    });

    if (this.history.length > 20) {
      this.history.shift(); // limit memory to keep context tight
    }
    this.saveToStorage();
  }

  getRecent(limit = 6): MemoryMessage[] {
    return this.history.slice(-limit);
  }

  getFull(): MemoryMessage[] {
    return this.history;
  }

  clear() {
    this.history = [];
    this.saveToStorage();
  }
}
