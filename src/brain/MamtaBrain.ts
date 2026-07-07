export class MamtaBrain {
  private memory: { input: string; response: string }[] = [];
  private cache: Map<string, string> = new Map();
  private isBusy: boolean = false;

  constructor() {
    this.memory = [];
    this.cache = new Map();
    this.isBusy = false;
  }

  // 🔍 INPUT ANALYZER
  analyzeInput(input: string) {
    return {
      text: input,
      length: input.length,
      hasCommand: input.startsWith("/"),
    };
  }

  // 🧠 INTENT DETECTION
  detectIntent(input: string) {
    const text = input.toLowerCase();

    if (text.includes("plan")) return "planning";
    if (text.includes("build")) return "developer";
    if (text.includes("error")) return "debug";
    if (text.includes("why")) return "reasoning";
    if (text.includes("how")) return "learning";

    return "chat";
  }

  // 🚦 ROUTER
  route(input: string, intent: string) {
    if (this.useLocal(intent, input)) {
      return "LOCAL";
    }

    return "AI";
  }

  // ⚡ SMART DECISION
  useLocal(intent: string, input: string) {
    if (intent === "chat" && input.length < 25) return true;
    if (input.toLowerCase() === "hi") return true;

    return false;
  }

  // 🧠 LOCAL BRAIN
  localBrain(input: string) {
    const text = input.toLowerCase().trim();

    if (text === "hi" || text === "hello" || text === "hey" || text === "namaste") {
      return "Hi 👋 What can I help you with today?";
    }

    if (text.includes("how are you")) {
      return "I'm doing great 😊 What about you?";
    }

    if (text.includes("thank")) {
      return "You're welcome 🙌";
    }

    return "Got it 👍 Tell me more.";
  }

  // 🌐 AI ENGINE
  async aiBrain(input: string, sessionId: string) {
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sessionId, 
          content: input, 
          pageSource: "home",
          intent: this.detectIntent(input)
        })
      });

      const data = await res.json();
      return data.modelMessage?.content || data.reply || "No response";
    } catch (e) {
      return this.fallback();
    }
  }

  // ⚠️ FAILSAFE
  fallback() {
    return "⚠️ AI is busy, but I'm still here 👍";
  }

  // 🧠 MEMORY
  addMemory(entry: { input: string; response: string }) {
    this.memory.push(entry);
    if (this.memory.length > 20) this.memory.shift();
  }

  // 🎯 RESPONSE FORMAT
  formatResponse(text: string, intent: string) {
    if (intent === "chat") {
      return text.length > 150 ? text.slice(0, 150) + "..." : text;
    }

    return text;
  }

  // 🚀 MAIN PROCESS
  async process(input: string, sessionId: string): Promise<string> {
    if (this.isBusy) return "⏳ Processing...";

    this.isBusy = true;

    const analyzed = this.analyzeInput(input);
    const intent = this.detectIntent(input);
    const route = this.route(input, intent);

    let response;

    // 🚫 BLOCK BUILD COMMAND
    if (input.startsWith("/build")) {
      this.isBusy = false;
      return "⚠️ Please run this in Workspace.";
    }

    // ⚡ CACHE CHECK
    if (this.cache.has(input)) {
      this.isBusy = false;
      return this.cache.get(input)!;
    }

    // 🔀 ROUTING
    if (route === "LOCAL") {
      response = this.localBrain(input);
      
      // Asynchronously sync local response to Firestore so it shows in history on load/refresh
      try {
        fetch("/api/chats/save-local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            content: input,
            response: response,
            pageSource: "home"
          })
        }).catch(err => console.warn("Failed to sync local response to DB:", err));
      } catch (err) {
        console.warn("Save local background catch:", err);
      }
    } else {
      response = await this.aiBrain(input, sessionId);
    }

    this.addMemory({ input, response });

    const finalRes = this.formatResponse(response, intent);

    this.cache.set(input, finalRes);

    this.isBusy = false;

    return finalRes;
  }
}
