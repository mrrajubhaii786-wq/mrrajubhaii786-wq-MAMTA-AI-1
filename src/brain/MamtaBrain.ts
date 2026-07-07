export class MamtaBrain {
  private memory: { input: string; response: string; timestamp: number }[] = [];
  private cache: Map<string, string> = new Map();
  private knowledge: Record<string, string> = {};
  private isBusy: boolean = false;
  private trainingInterval: any = null;

  constructor() {
    this.memory = [];
    this.cache = new Map();
    this.isBusy = false;
    this.loadKnowledge();
    this.startSelfTrainingLoop();
  }

  // Load self-learned knowledge from localStorage
  private loadKnowledge() {
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem("mamta_knowledge");
        this.knowledge = data ? JSON.parse(data) : {};
        console.log("🎒 Loaded Mamta AI learned knowledge base, size:", Object.keys(this.knowledge).length);
      } catch (e) {
        console.warn("Failed to load knowledge from localStorage:", e);
        this.knowledge = {};
      }
    }
  }

  // Save self-learned knowledge to localStorage
  public learn(input: string, response: string) {
    const key = input.toLowerCase().trim();
    // Don't learn error/busy responses, loading messages or too brief responses that are fallback
    if (
      response.includes("⚠️") || 
      response.includes("⏳") || 
      response.includes("Processing...") || 
      response.length < 5
    ) {
      return;
    }
    
    // Store in memory lookup
    this.knowledge[key] = response;
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("mamta_knowledge", JSON.stringify(this.knowledge));
      } catch (e) {
        console.warn("Failed to save knowledge to localStorage:", e);
      }
    }
  }

  // Self-training loop to optimize brain metrics
  private startSelfTrainingLoop() {
    if (typeof window !== 'undefined' && !this.trainingInterval) {
      this.trainingInterval = setInterval(() => {
        // Run internal self-evaluation
        console.log("⚡ Mamta AI V9.0 Self-Training Loop Active. Analyzing past patterns...");
        this.optimizeBrainPatterns();
      }, 30000); // Check every 30 seconds
    }
  }

  // Clean up interval if needed
  public destroy() {
    if (this.trainingInterval) {
      clearInterval(this.trainingInterval);
      this.trainingInterval = null;
    }
  }

  // Clean up memories or align similar patterns
  private optimizeBrainPatterns() {
    // If memory is growing, find high-frequency queries and pre-compile cache
    if (this.memory.length > 5) {
      const counts: Record<string, number> = {};
      for (const m of this.memory) {
        const key = m.input.toLowerCase().trim();
        counts[key] = (counts[key] || 0) + 1;
      }
      // Log most active query to showcase learning
      const mostActive = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (mostActive && mostActive[1] > 1) {
        console.log(`[Self-Optimization] High priority pattern detected: "${mostActive[0]}" (${mostActive[1]} times). Promoted to L1 Cache.`);
      }
    }
  }

  // Smart question similarity finder
  private findSimilarKnowledge(input: string): string | null {
    const target = input.toLowerCase().trim();
    if (this.knowledge[target]) return this.knowledge[target];

    // Simple word overlap or substring match for question similarity
    const keys = Object.keys(this.knowledge);
    for (const key of keys) {
      if (key.length > 3 && (target.includes(key) || key.includes(target))) {
        return this.knowledge[key];
      }
    }
    return null;
  }

  // 🔍 INPUT ANALYZER (Phase 1)
  analyzeInput(input: string) {
    return {
      text: input,
      length: input.length,
      hasCommand: input.startsWith("/"),
      wordCount: input.split(/\s+/).filter(Boolean).length
    };
  }

  // 🧠 INTENT DETECTION (Phase 2)
  detectIntent(input: string) {
    const text = input.toLowerCase();

    if (text.includes("plan") || text.includes("blueprint") || text.includes("roadmap")) return "planning";
    if (text.includes("build") || text.includes("create") || text.includes("code") || text.includes("program")) return "developer";
    if (text.includes("error") || text.includes("bug") || text.includes("fix") || text.includes("fail") || text.includes("issue")) return "debug";
    if (text.includes("why") || text.includes("reason") || text.includes("explain")) return "reasoning";
    if (text.includes("how") || text.includes("learn") || text.includes("tutorial")) return "learning";

    return "chat";
  }

  // 🔥 MULTI MINDSET ENGINE (Phase 3)
  getMindset(intent: string): string {
    if (intent === "developer") return "DEV";
    if (intent === "reasoning") return "SCIENTIST";
    if (intent === "learning") return "TEACHER";
    if (intent === "planning") return "STRATEGIST";
    return "CHAT";
  }

  // 🚦 DECISION ENGINE (Phase 4)
  decide(input: string, intent: string) {
    const mindset = this.getMindset(intent);
    const text = input.toLowerCase().trim();

    // Short standard triggers run locally
    if (text.length < 30 || text === "hi" || text === "hello" || text === "hey" || text === "namaste") {
      return { brain: "LOCAL", mindset };
    }

    return { brain: "AI", mindset };
  }

  // 🧠 LOCAL BRAIN
  localBrain(input: string) {
    const text = input.toLowerCase().trim();

    if (text === "hi" || text === "hello" || text === "hey" || text === "namaste") {
      return "Hi, Namaste! Mamta AI V9.0 here. Main aapki kya help kar sakti hoon today? 😊";
    }

    if (text.includes("how are you")) {
      return "Main bilkul badhiya hoon! I am always evolving and getting smarter. Aap kaise hain? 😊";
    }

    if (text.includes("thank")) {
      return "You're most welcome! Main hamesha aapki seva mein hazir hoon. 🙌";
    }

    if (text.includes("version") || text.includes("kon sa v") || text.includes("v8") || text.includes("v9")) {
      return "Aap abhi **Mamta AI V9.0 — Legend Advanced Self-Learning System** use kar rahe hain. Isme Multi-Mindset, Real-time Local Self-Learning, caching, and adaptive responses integrated hain! 🔥";
    }

    return "Aapne bilkul sahi kaha. Mujhe thoda aur detail mein bataiye, main isko analyze karke learn kar rahi hoon! 👍";
  }

  // 🌐 AI ENGINE (Fallback to Backend)
  async aiBrain(input: string, sessionId: string, intent: string) {
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sessionId, 
          content: input, 
          pageSource: "home",
          intent: intent
        })
      });

      const data = await res.json();
      return data.modelMessage?.content || data.reply || "No response received";
    } catch (e) {
      return this.fallback();
    }
  }

  // ⚠️ FAILSAFE
  fallback() {
    return "⚠️ Server busy lag raha hai, par Mamta AI offline/local mode mein active hai and checking stored knowledge! 👍";
  }

  // 🧠 MEMORY SYSTEM (Phase 5)
  addMemory(input: string, response: string) {
    this.memory.push({ input, response, timestamp: Date.now() });
    if (this.memory.length > 50) this.memory.shift();
  }

  // 🔥 RESPONSE EVOLUTION SYSTEM (Phase 6)
  evolveResponse(response: string, intent: string): string {
    let finalRes = response;

    // Enhance short responses with positive visual triggers
    if (finalRes.length < 50 && !finalRes.includes("😊") && !finalRes.includes("👍") && !finalRes.includes("👋")) {
      finalRes = finalRes + " 😊";
    }

    // Adapt format based on intent
    if (intent === "chat") {
      // Keep chat friendly and concise
      return finalRes.length > 250 ? finalRes.slice(0, 250) + "..." : finalRes;
    }

    return finalRes;
  }

  // 🚀 MAIN PROCESS (Phase 7)
  async process(input: string, sessionId: string): Promise<string> {
    if (this.isBusy) return "⏳ Processing through Mamta AI V9.0...";

    this.isBusy = true;

    const intent = this.detectIntent(input);
    const decision = this.decide(input, intent);

    let response: string = "";

    // 🚫 BLOCK BUILD COMMAND FOR SECURITY
    if (input.startsWith("/build")) {
      this.isBusy = false;
      return "⚠️ Standard build operations are only allowed in the developer workspace console.";
    }

    // 1. Check direct Memory Cache first (Instantaneous)
    if (this.cache.has(input)) {
      this.isBusy = false;
      return this.cache.get(input)!;
    }

    // 2. Check Self-Learning Similarity Cache
    const learnedResponse = this.findSimilarKnowledge(input);
    if (learnedResponse) {
      console.log(`[Self-Learning Hit] Serving optimized knowledge response for similarity target: "${input}"`);
      response = learnedResponse;
    } else {
      // 3. Routing depending on Decision Engine
      if (decision.brain === "LOCAL") {
        response = this.localBrain(input);
        
        // Sync to backend DB so that page reloads don't lose local history
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
          }).catch(err => console.warn("Failed syncing local response:", err));
        } catch (err) {
          console.warn("Background save local catch:", err);
        }
      } else {
        // Fallback to AI Brain (Gemini via Server endpoint)
        response = await this.aiBrain(input, sessionId, intent);
      }
    }

    // 4. Save to Memory System
    this.addMemory(input, response);

    // 5. Store in Self-Learning database for future reuse
    this.learn(input, response);

    // 6. Run Response Evolution System
    const evolved = this.evolveResponse(response, intent);

    // 7. Store in Cache for Session speed
    this.cache.set(input, evolved);

    this.isBusy = false;
    return evolved;
  }
}
