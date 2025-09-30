import { EngageRawEvent, PublicEvent } from "./types";

// Server-only Engage client with strict filtering and normalization
// Never import this into client components.

const ENGAGE_BASE = process.env.ENGAGE_BASE || "https://rowan.campuslabs.com/engage";

function toIsoNow(): string {
  return new Date().toISOString();
}

export interface EngageFetchOptions {
  endsAfterIso?: string;
  take?: number;
  abortSignal?: AbortSignal;
}

async function fetchWithRetry(url: string, init: RequestInit, attempts: number): Promise<Response> {
  let lastError: unknown;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      const res = await fetch(url, init);
      if (!res.ok) {
        lastError = new Error(`HTTP ${res.status}`);
      } else {
        return res;
      }
    } catch (err) {
      lastError = err;
    }
    // basic backoff: 250ms, 500ms
    if (i < attempts) {
      await new Promise((r) => setTimeout(r, 250 * i));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Unknown fetch error");
}

export async function fetchEngageEvents(options?: EngageFetchOptions): Promise<EngageRawEvent[]> {
  const endsAfterIso = options?.endsAfterIso ?? toIsoNow();
  const take = options?.take ?? 2000;
  const url = new URL(`${ENGAGE_BASE}/api/discovery/event/search`);
  url.searchParams.set("endsAfter", endsAfterIso);
  url.searchParams.set("orderByField", "endsOn");
  url.searchParams.set("orderByDirection", "ascending");
  url.searchParams.set("status", "Approved");
  url.searchParams.set("take", String(take));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetchWithRetry(
      url.toString(),
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "ruhungry/1.0 (+https://github.com/ruhungry)",
        },
      },
      3,
    );
    const data = (await res.json()) as unknown;
    if (Array.isArray(data)) {
      return data as EngageRawEvent[];
    }
    if (data && typeof data === "object" && Array.isArray((data as { value?: unknown[] }).value)) {
      return (data as { value: EngageRawEvent[] }).value;
    }
    throw new Error("Unexpected Engage response format");
  } finally {
    clearTimeout(timeout);
  }
}

export interface StrictFilterOptions {
  nowIso?: string; // default now
}

export function filterFreeFoodStrict(raw: EngageRawEvent[], opts?: StrictFilterOptions): EngageRawEvent[] {
  const now = opts?.nowIso ? new Date(opts.nowIso) : new Date();
  return raw.filter((e) => {
    const endsOn = new Date(e.endsOn);
    if (Number.isNaN(endsOn.getTime())) return false;
    const isFuture = endsOn.getTime() >= now.getTime();
    const isPublic = (e.visibility || "").toLowerCase() === "public";
    const isApproved = (e.status || "").toLowerCase() === "approved";
    const hasBenefit = Array.isArray(e.benefitNames) && e.benefitNames.some((b) => b.toLowerCase() === "free food");
    return isFuture && isPublic && isApproved && hasBenefit;
  });
}

export function normalizeToPublic(e: EngageRawEvent): PublicEvent {
  const org = e.organizationName ?? (Array.isArray(e.organizationNames) && e.organizationNames.length > 0 ? e.organizationNames[0] : null);
  const base = ENGAGE_BASE.replace(/\/$/, "");
  const eventUrl = `${base}/event/${e.id}`;
  // imagePath in Engage is typically a token; full URL can vary. If uncertain, omit in v1.
  const imageUrl = e.imagePath ? `${base}/image/${e.imagePath}` : null;

  return {
    id: e.id,
    title: e.name,
    startsOn: e.startsOn,
    endsOn: e.endsOn,
    org,
    locationText: e.location ?? null,
    benefits: Array.isArray(e.benefitNames) ? e.benefitNames : [],
    eventUrl,
    imageUrl,
  };
}


