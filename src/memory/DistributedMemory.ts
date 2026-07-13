// src/memory/DistributedMemory.ts

let redisInstance: any = null;

// Dynamically import Redis only on the server side to prevent browser bundling issues with ioredis
if (typeof window === "undefined") {
  const redisPath = "./RedisClient" + "";
  import(/* @vite-ignore */ redisPath)
    .then((mod) => {
      redisInstance = mod.redis;
    })
    .catch((err) => {
      console.warn("⚠️ [DistributedMemory] Failed to dynamically load RedisClient on server:", err.message);
    });
}

/**
 * Saves a value to the distributed memory store.
 * Supports server-side direct Redis writing and browser-side API proxy routing.
 */
export async function saveMemory(key: string, value: any): Promise<void> {
  const stringified = JSON.stringify(value);

  // If on server and Redis is initialized, use direct TCP connection
  if (typeof window === "undefined" && redisInstance) {
    try {
      await redisInstance.set(key, stringified);
      console.log(`🧠 [DistributedMemory-Server] Saved direct to Redis: "${key}"`);
      return;
    } catch (err: any) {
      console.warn(`⚠️ [DistributedMemory-Server] Redis direct write failed, falling back:`, err.message);
    }
  }

  // Local browser caching fallback
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`mamta_redis_emulation_${key}`, stringified);
    } catch (e) {
      // Ignore quota limits
    }
  }

  // Client-side/Server-side API sync fallback
  try {
    const res = await fetch("/api/distributed-memory/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, value }),
    });
    if (res.ok) {
      console.log(`🧠 [DistributedMemory] Synced key: "${key}" to server cluster memory.`);
    }
  } catch (err: any) {
    console.warn(`⚠️ [DistributedMemory] Server sync failed for key: "${key}", relying on local state:`, err.message);
  }
}

/**
 * Loads a value from the distributed memory store (as getMemory).
 */
export async function getMemory<T = any>(key: string): Promise<T | null> {
  // If on server and Redis is initialized, read direct from Redis
  if (typeof window === "undefined" && redisInstance) {
    try {
      const data = await redisInstance.get(key);
      if (data) {
        return JSON.parse(data) as T;
      }
    } catch (err: any) {
      console.warn(`⚠️ [DistributedMemory-Server] Redis direct read failed, falling back:`, err.message);
    }
  }

  // 1. Try local server-side endpoint first
  try {
    const res = await fetch(`/api/distributed-memory/load?key=${encodeURIComponent(key)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.value !== undefined) {
        return data.value as T;
      }
    }
  } catch (err: any) {
    console.warn(`⚠️ [DistributedMemory] Fetch from server failed for: "${key}":`, err.message);
  }

  // 2. Check browser local storage fallback
  if (typeof window !== "undefined") {
    try {
      const localVal = localStorage.getItem(`mamta_redis_emulation_${key}`);
      if (localVal) {
        return JSON.parse(localVal) as T;
      }
    } catch (e) {
      return null;
    }
  }

  return null;
}

/**
 * Aliased getMemory to loadMemory to support complete backward compatibility.
 */
export async function loadMemory<T = any>(key: string): Promise<T | null> {
  return getMemory<T>(key);
}

/**
 * A highly resilient distributed memory synchronization client class for backward compatibility.
 */
export class DistributedMemoryService {
  public async saveMemory(key: string, value: any): Promise<void> {
    return saveMemory(key, value);
  }

  public async loadMemory<T = any>(key: string): Promise<T | null> {
    return getMemory<T>(key);
  }
}

// Global singleton instance for backwards compatibility
export const distributedMemory = new DistributedMemoryService();

// Support for DistributedMemory.save and DistributedMemory.load syntax (Master Plan 15)
export const DistributedMemory = {
  save: saveMemory,
  load: loadMemory,
};

