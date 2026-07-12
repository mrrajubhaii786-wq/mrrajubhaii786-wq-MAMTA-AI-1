import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

console.log(`🧠 [RedisClient] Initializing connection to: ${redisUrl.split("@").pop()}`);

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Essential for bull queue compatibility
  retryStrategy(times) {
    // Retry with exponential backoff up to 10 seconds
    const delay = Math.min(times * 100, 10000);
    return delay;
  },
});

redis.on("connect", () => {
  console.log("🧠 [RedisClient] Redis Connected Successfully!");
});

redis.on("error", (err) => {
  console.warn("⚠️ [RedisClient] Redis Connection Warning/Error:", err.message);
});
