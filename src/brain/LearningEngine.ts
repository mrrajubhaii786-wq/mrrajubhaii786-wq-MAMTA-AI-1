import { db } from "../lib/firebase";
import { collection, getDocs, limit, query, orderBy, doc, setDoc } from "firebase/firestore";

export interface MemoryItem {
  input: string;
  intent: string;
  response: string;
  usage: number;
  lastUsed: number;
  timestamp: number;
}

export class LearningEngine {
  private localFallback: Record<string, string> = {};
  private memories: Record<string, MemoryItem> = {};

  async init() {
    this.loadLocalFallback();
  }

  private loadLocalFallback() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("mamta_knowledge_v11");
        if (stored) {
          this.memories = JSON.parse(stored);
          // populate localFallback for compatibility
          Object.keys(this.memories).forEach(key => {
            this.localFallback[key] = this.memories[key].response;
          });
        } else {
          // migration/compatibility from old mamta_knowledge
          const oldStored = localStorage.getItem("mamta_knowledge");
          if (oldStored) {
            const oldData = JSON.parse(oldStored);
            Object.keys(oldData).forEach(key => {
              this.memories[key] = {
                input: key,
                intent: "CHAT",
                response: oldData[key],
                usage: 1,
                lastUsed: Date.now(),
                timestamp: Date.now()
              };
              this.localFallback[key] = oldData[key];
            });
          }
        }
      } catch (e) {
        console.warn("[LearningEngine] LocalStorage load failed:", e);
      }
    }
  }

  async save(input: string, response: string, intent = "CHAT"): Promise<void> {
    await this.learn(input, response, intent);
  }

  async saveMemory(input: string, response: string): Promise<void> {
    await this.learn(input, response, "CHAT");
  }

  async learn(input: string, response: string, intent = "CHAT"): Promise<void> {
    const key = input.toLowerCase().trim();
    
    // Guard: Don't learn error/busy responses, loading messages or extremely brief placeholders
    if (
      response.includes("⚠️") || 
      response.includes("⏳") || 
      response.includes("Processing...") || 
      response.length < 5
    ) {
      return;
    }

    const currentMemory = this.memories[key];
    const usage = currentMemory ? currentMemory.usage + 1 : 1;

    const memoryItem: MemoryItem = {
      input: key,
      intent,
      response,
      usage,
      lastUsed: Date.now(),
      timestamp: currentMemory ? currentMemory.timestamp : Date.now()
    };

    // Save locally
    this.memories[key] = memoryItem;
    this.localFallback[key] = response;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("mamta_knowledge_v11", JSON.stringify(this.memories));
        localStorage.setItem("mamta_knowledge", JSON.stringify(this.localFallback));
      } catch (e) {
        console.warn("[LearningEngine] LocalStorage save failed:", e);
      }
    }

    // Persist in Google Cloud Firestore
    if (db) {
      try {
        // Sanitize docId to be a clean string
        const cleanDocId = key.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 50) || "default_key";

        // Save to BOTH "learning_memory" and "knowledge" to preserve compatibility with AdminView.tsx
        const payload = {
          ...memoryItem,
          // for compatibility with older structures
          timestamp: memoryItem.timestamp
        };

        // Write to "knowledge" so AdminView.tsx can fetch and delete it
        await setDoc(doc(db, "knowledge", cleanDocId), payload, { merge: true });
        
        // Write to "learning_memory" collection for Level 2 Dynamic Memory System
        await setDoc(doc(db, "learning_memory", cleanDocId), payload, { merge: true });

        console.log(`[LearningEngine] Firestore Dynamic Memory Synced for: "${key}" (Usage: ${usage})`);
      } catch (err) {
        console.warn("[LearningEngine] Firestore knowledge insert deferred:", err);
      }
    }
  }

  async recall(input: string): Promise<string | null> {
    const target = input.toLowerCase().trim();

    // Check direct match
    if (this.memories[target]) {
      const item = this.memories[target];
      item.usage++;
      item.lastUsed = Date.now();
      
      // Update asynchronously in background
      this.learn(item.input, item.response, item.intent).catch(err => {
        console.warn("[LearningEngine] Background update of memory failed:", err);
      });
      
      console.log(`🧠 [Memory Recall Hit] Exact match: "${target}" (Usage count updated to ${item.usage})`);
      return item.response;
    }

    // Check fuzzy match
    const keys = Object.keys(this.memories);
    for (const key of keys) {
      if (key.length > 3 && (target.includes(key) || key.includes(target))) {
        const item = this.memories[key];
        item.usage++;
        item.lastUsed = Date.now();
        
        // Update asynchronously in background
        this.learn(item.input, item.response, item.intent).catch(err => {
          console.warn("[LearningEngine] Background update of memory failed:", err);
        });

        console.log(`🧠 [Memory Recall Hit] Fuzzy match: "${key}" for target "${target}" (Usage count updated to ${item.usage})`);
        return item.response;
      }
    }

    return null;
  }

  optimize() {
    console.log("🧠 Self-learning optimization running...");
    const keys = Object.keys(this.memories);
    console.log(`[Optimization] Current cognitive memory has ${keys.length} learning nodes active.`);
    
    if (keys.length > 0) {
      // Find the most frequently used memory node
      const sorted = [...keys].sort((a, b) => this.memories[b].usage - this.memories[a].usage);
      const topNode = this.memories[sorted[0]];
      console.log(`[Optimization] Top active memory node: "${topNode.input}" with usage count: ${topNode.usage}`);
    }
  }

  async loadKnowledge(): Promise<Record<string, string>> {
    const knowledgeMap: Record<string, string> = { ...this.localFallback };

    if (db) {
      try {
        // Load from "learning_memory" first, falling back to "knowledge"
        const q1 = query(collection(db, "learning_memory"), orderBy("timestamp", "desc"), limit(100));
        const snapshot1 = await getDocs(q1);

        if (!snapshot1.empty) {
          snapshot1.forEach(doc => {
            const d = doc.data() as MemoryItem;
            if (d.input && d.response) {
              const key = d.input.toLowerCase().trim();
              this.memories[key] = {
                input: d.input,
                intent: d.intent || "CHAT",
                response: d.response,
                usage: d.usage || 1,
                lastUsed: d.lastUsed || d.timestamp || Date.now(),
                timestamp: d.timestamp || Date.now()
              };
              knowledgeMap[key] = d.response;
              this.localFallback[key] = d.response;
            }
          });
          console.log(`[LearningEngine] Sync complete: Loaded ${snapshot1.size} items from Firestore learning_memory.`);
        } else {
          // If empty, try reading from legacy "knowledge"
          const q2 = query(collection(db, "knowledge"), orderBy("timestamp", "desc"), limit(100));
          const snapshot2 = await getDocs(q2);
          
          snapshot2.forEach(doc => {
            const d = doc.data();
            if (d.input && d.response) {
              const key = d.input.toLowerCase().trim();
              this.memories[key] = {
                input: d.input,
                intent: d.intent || "CHAT",
                response: d.response,
                usage: d.usage || 1,
                lastUsed: d.lastUsed || d.timestamp || Date.now(),
                timestamp: d.timestamp || Date.now()
              };
              knowledgeMap[key] = d.response;
              this.localFallback[key] = d.response;
            }
          });
          console.log(`[LearningEngine] Sync complete: Loaded ${snapshot2.size} items from legacy Firestore knowledge base.`);
        }
      } catch (err) {
        console.warn("[LearningEngine] Firestore retrieval deferred, using local storage cache:", err);
      }
    }

    return knowledgeMap;
  }
}
