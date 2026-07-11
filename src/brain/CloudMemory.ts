import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function saveMemory(input: string, output: any): Promise<void> {
  console.log(`☁️ [CloudMemory] Attempting to store memory in Firestore: "${input.substring(0, 30)}..."`);
  try {
    const memoryCol = collection(db, "memory");
    await addDoc(memoryCol, {
      input,
      output: typeof output === "object" ? JSON.stringify(output) : String(output),
      time: Date.now()
    });
    console.log("✅ [CloudMemory] Memory persisted in Cloud Firestore safely.");
  } catch (err: any) {
    console.error("⚠️ [CloudMemory] Firestore cloud storage failed or needs authentication. Saving locally...", err);
    // Fallback to storing in local storage
    try {
      const offlineMemories = JSON.parse(localStorage.getItem("mamta_ai_offline_cloud_memory") || "[]");
      offlineMemories.push({ input, output, time: Date.now() });
      localStorage.setItem("mamta_ai_offline_cloud_memory", JSON.stringify(offlineMemories.slice(-50)));
    } catch (e) {
      console.error("Offline fallback storage failed:", e);
    }
  }
}
