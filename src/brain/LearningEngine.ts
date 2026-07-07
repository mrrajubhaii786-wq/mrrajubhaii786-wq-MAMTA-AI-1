import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, addDoc, getDocs, limit, query, orderBy } from "firebase/firestore";

export class LearningEngine {
  private localFallback: Record<string, string> = {};

  async init() {
    this.loadLocalFallback();
  }

  private loadLocalFallback() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("mamta_knowledge");
        this.localFallback = stored ? JSON.parse(stored) : {};
      } catch (e) {
        console.warn("[LearningEngine] LocalStorage load failed:", e);
      }
    }
  }

  async save(input: string, response: string): Promise<void> {
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

    // Save to local in-memory knowledge maps
    this.localFallback[key] = response;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("mamta_knowledge", JSON.stringify(this.localFallback));
      } catch (e) {
        console.warn("[LearningEngine] LocalStorage save failed:", e);
      }
    }

    // Attempt to persist in Google Cloud Firestore as persistent knowledge
    if (db) {
      try {
        await addDoc(collection(db, "knowledge"), {
          input: key,
          response: response,
          timestamp: Date.now()
        });
        console.log(`[LearningEngine] Firestore Knowledge Synced for: "${key}"`);
      } catch (err) {
        // Silent catch for local/offline developer flow
        console.warn("[LearningEngine] Firestore knowledge insert deferred:", err);
      }
    }
  }

  async loadKnowledge(): Promise<Record<string, string>> {
    const knowledgeMap: Record<string, string> = { ...this.localFallback };

    if (db) {
      try {
        // Load the latest 50 learned items from firestore knowledge base
        const q = query(collection(db, "knowledge"), orderBy("timestamp", "desc"), limit(50));
        const snapshot = await getDocs(q);
        
        snapshot.forEach(doc => {
          const d = doc.data();
          if (d.input && d.response) {
            knowledgeMap[d.input] = d.response;
          }
        });
        console.log(`[LearningEngine] Sync complete: Loaded ${snapshot.size} items from Firestore Knowledge Base.`);
      } catch (err) {
        console.warn("[LearningEngine] Firestore knowledge retrieve deferred, using local storage cache:", err);
      }
    }

    return knowledgeMap;
  }
}
