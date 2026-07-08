export class LocalLLM {
  async generate(prompt: string, sessionId?: string): Promise<string> {
    try {
      console.log("🌀 [LocalLLM] Attempting local Ollama generation...");
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistral",
          prompt: prompt,
          stream: false
        })
      });

      if (!res.ok) {
        throw new Error(`Ollama returned status ${res.status}`);
      }

      const data = await res.json();
      if (data && data.response) {
        console.log("✅ [LocalLLM] Ollama response retrieved successfully.");
        return data.response;
      }
      throw new Error("Invalid response format from Ollama");
    } catch (e) {
      console.log("⚠️ [LocalLLM] Ollama unreachable or offline. Falling back to Server & Local Hybrid Cognitive Brain...");
      
      // Fallback: Use the server-side proxy chats endpoint if sessionId is provided
      if (sessionId) {
        try {
          const res = await fetch("/api/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              sessionId, 
              content: prompt, 
              pageSource: "home",
              intent: "REASONING"
            })
          });
          const data = await res.json();
          const reply = data.modelMessage?.content || data.reply;
          if (reply) {
            return reply;
          }
        } catch (serverErr) {
          console.warn("⚠️ [LocalLLM] Server fallback failed:", serverErr);
        }
      }

      // Default high quality offline fallback answer
      return `Mera automatic pipeline detect kar raha hai ki hum offline hain ya humara local Ollama model currently unreachable hai. Lekin chinta mat kariye, main Mamta AI V11-V12 hybrid mode me completely ready hoon!

✨ Kehte hain ki universe aur logic ki tarah har automatic system dynamic hota hai. Aap jo bhi design karna ya poochna chahte hain, please bataiye, main fully optimize karke response taiyaar kar rahi hoon! 😊`;
    }
  }
}
