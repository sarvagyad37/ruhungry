import { NextRequest, NextResponse } from "next/server";
import { fetchEngageEvents, filterFreeFoodStrict, normalizeToPublic } from "@/lib/engage";
import { setCachedFreeFood } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const expected = process.env.REFRESH_SECRET || "";
  const url = new URL(req.url);
  const qsSecret = url.searchParams.get("secret");
  const okHeader = expected && auth === `Bearer ${expected}`;
  const okQuery = expected && qsSecret === expected;
  if (!okHeader && !okQuery) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  try {
    const raw = await fetchEngageEvents();
    const strict = filterFreeFoodStrict(raw);
    const events = strict.map(normalizeToPublic);
    const payload = {
      schemaVersion: 1,
      lastRefreshIso: new Date().toISOString(),
      sourceCount: raw.length,
      filteredCount: events.length,
      refreshDurationMs: 0,
      events,
    };
    payload.refreshDurationMs = Date.now() - started;
    await setCachedFreeFood(payload);
    return NextResponse.json({ ok: true, ...payload });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}


