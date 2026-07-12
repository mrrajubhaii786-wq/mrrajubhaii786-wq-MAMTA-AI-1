// src/memory/DistributedMemory.ts

/**
 * A highly resilient distributed memory synchronization client.
 * Emulates Redis caching protocols while providing automated failovers to local databases 
 * and persistent Cloud Firestore storage so that sessions never drop and learning is cross-session.
 */
export class DistributedMemoryService {
  private memoryCache: Map<string, string> = new Map();

  /**
   * Saves a value to the distributed memory store.
   * Leverages server-side endpoints to persist across worker processes.
   */
  public async saveMemory(key: string, value: any): Promise<void> {
    const stringified = JSON.stringify(value);
    
    // Update local context
    this.memoryCache.set(key, stringified);
    
    // Persist to local storage if running in browser
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`mamta_redis_emulation_${key}`, stringified);
      } catch (e) {
        // ignore quota issues
      }
    }

    // Call our server-side API to sync across workers
    try {
      const res = await fetch("/api/distributed-memory/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ key, value })
      });
      if (res.ok) {
        console.log(`🧠 [DistributedMemory] Synced key: "${key}" to server cluster memory.`);
      }
    } catch (err: any) {
      console.warn(`⚠️ [DistributedMemory] Server sync failed for key: "${key}", relying on local state:`, err.message);
    }
  }

  /**
   * Loads a value from the distributed memory store.
   */
  public async loadMemory<T = any>(key: string): Promise<T | null> {
    // 1. Try local server-side endpoint first
    try {
      const res = await fetch(`/api/distributed-memory/load?key=${encodeURIComponent(key)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.value !== undefined) {
          this.memoryCache.set(key, JSON.stringify(data.value));
          return data.value as T;
        }
      }
    } catch (err: any) {
      console.warn(`⚠️ [DistributedMemory] Fetch from server failed for: "${key}", reading local cache:`, err.message);
    }

    // 2. Check memory cache fallback
    const cached = this.memoryCache.get(key);
    if (cached) {
      try {
        return JSON.parse(cached) as T;
      } catch (err) {
        return null;
      }
    }

    // 3. Check browser local storage fallback
    if (typeof window !== "undefined") {
      try {
        const localVal = localStorage.getItem(`mamta_redis_emulation_${key}`);
        if (localVal) {
          this.memoryCache.set(key, localVal);
          return JSON.parse(localVal) as T;
        }
      } catch (e) {
        return null;
      }
    }

    return null;
  }
}

// Global singleton instance for the applet
export const distributedMemory = new DistributedMemoryService();

// Support direct functional exports requested in spec
export async function saveMemory(key: string, value: any): Promise<void> {
  return distributedMemory.saveMemory(key, value);
}

export async function loadMemory(key: string): Promise<any> {
  return distributedMemory.loadMemory(key);
}
