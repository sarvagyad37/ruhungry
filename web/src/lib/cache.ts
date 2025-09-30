import { Redis } from "@upstash/redis";
import { FreeFoodCachePayload } from "./types";

const EVENTS_KEY = "free_food_events";

// In-memory fallback for local dev without KV
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = globalThis as any;
if (!globalAny.__memoryCache) {
  globalAny.__memoryCache = { [EVENTS_KEY]: null as FreeFoodCachePayload | null };
}

const restUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || null;
const restToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || null;
const redis = restUrl && restToken ? new Redis({ url: restUrl, token: restToken }) : null;

export async function getCachedFreeFood(): Promise<FreeFoodCachePayload | null> {
  if (redis) {
    try {
      const payload = await redis.get<FreeFoodCachePayload>(EVENTS_KEY);
      if (payload) return payload;
    } catch (_err) {
      // ignore and fall back
    }
  }
  return globalAny.__memoryCache[EVENTS_KEY] ?? null;
}

export async function setCachedFreeFood(payload: FreeFoodCachePayload): Promise<void> {
  if (redis) {
    try {
      await redis.set(EVENTS_KEY, payload);
      return;
    } catch (_err) {
      // fall through to memory cache
    }
  }
  globalAny.__memoryCache[EVENTS_KEY] = payload;
}


