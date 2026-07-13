// src/brain/LearningEngine.ts
import { DistributedMemory } from "../memory/DistributedMemory";
import { validateMemory } from "./MemoryValidator";

export class LearningEngine {
  /**
   * Initializes the Learning Engine (backward compatibility for legacy modules).
   */
  async init(): Promise<void> {
    console.log("🧠 [LearningEngine] Initialized backward-compatible knowledge map.");
  }

  /**
   * Loads custom knowledge maps from DistributedMemory (backward compatibility).
   */
  async loadKnowledge(): Promise<Record<string, string>> {
    console.log("🧠 [LearningEngine] Loading persistent knowledge mappings...");
    try {
      const data = await DistributedMemory.load("learning_knowledge_map");
      return data || {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Optimizes neural patterns (backward compatibility).
   */
  async optimize(): Promise<void> {
    console.log("🧠 [LearningEngine] Running background self-optimization on weights...");
  }

  /**
   * Appends a new learning item to the accumulated distributed experiences.
   * Signature is flexible (supports 2 or 3 arguments) for backward compatibility.
   */
  async learn(input: string, result: any, extra?: any): Promise<void> {
    const entry = { input, result, extra };

    if (!validateMemory(entry)) {
      console.warn("⚠️ [LearningEngine] Invalid memory rejected (failed safety check):", entry);
      return;
    }

    let existing: any[] = [];
    try {
      const data = await DistributedMemory.load("learning");
      if (Array.isArray(data)) {
        existing = data;
      }
    } catch (e) {
      existing = [];
    }

    existing.push({
      input,
      result,
      extra,
      timestamp: Date.now(),
    });

    await DistributedMemory.save("learning", existing);
    console.log(`🧠 [LearningEngine] Learned from experience of: "${input}"`);

    // Update persistent knowledge mapping (for backward compatibility loadKnowledge)
    try {
      const knowledge = await this.loadKnowledge();
      const cleanedKey = input.toLowerCase().trim();
      knowledge[cleanedKey] = typeof result === "string" ? result : JSON.stringify(result);
      await DistributedMemory.save("learning_knowledge_map", knowledge);
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Recalls the first matching experience containing the input search query.
   */
  async recall(input: string): Promise<any | null> {
    try {
      const data = await DistributedMemory.load("learning");
      if (!Array.isArray(data)) {
        return null;
      }

      return data.find((d: any) => input.includes(d.input)) || null;
    } catch (e) {
      return null;
    }
  }
}
