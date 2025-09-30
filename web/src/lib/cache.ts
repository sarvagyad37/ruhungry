import { kv } from "@vercel/kv";
import { FreeFoodCachePayload } from "./types";

const EVENTS_KEY = "free_food_events";

// In-memory fallback for local dev without KV
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = globalThis as any;
if (!globalAny.__memoryCache) {
  globalAny.__memoryCache = { [EVENTS_KEY]: null as FreeFoodCachePayload | null };
}

export async function getCachedFreeFood(): Promise<FreeFoodCachePayload | null> {
  try {
    const payload = await kv.get<FreeFoodCachePayload>(EVENTS_KEY);
    if (payload) return payload;
  } catch (_err) {
    // ignore
  }
  // Fallback to in-memory cache
  return globalAny.__memoryCache[EVENTS_KEY] ?? null;
}

export async function setCachedFreeFood(payload: FreeFoodCachePayload): Promise<void> {
  try {
    await kv.set(EVENTS_KEY, payload);
  } catch (_err) {
    // Fallback to in-memory cache
    globalAny.__memoryCache[EVENTS_KEY] = payload;
  }
}


