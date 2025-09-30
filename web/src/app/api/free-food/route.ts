import { NextRequest, NextResponse } from "next/server";
import { getCachedFreeFood } from "@/lib/cache";

export const dynamic = "force-dynamic";

function enableCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
}

export async function OPTIONS() {
  const res = NextResponse.json({ ok: true });
  enableCors(res);
  return res;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const fromIso = url.searchParams.get("from");
  const toIso = url.searchParams.get("to");
  const org = url.searchParams.get("org");
  const limitRaw = url.searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitRaw || 100), 1), 1000);

  const resPayload = await getCachedFreeFood();
  if (!resPayload) {
    const res = NextResponse.json({ events: [], lastRefresh: null, count: 0 });
    enableCors(res);
    return res;
  }

  let events = resPayload.events.slice();
  if (fromIso) {
    const from = new Date(fromIso);
    if (!Number.isNaN(from.getTime())) {
      events = events.filter((e) => new Date(e.endsOn).getTime() >= from.getTime());
    }
  }
  if (toIso) {
    const to = new Date(toIso);
    if (!Number.isNaN(to.getTime())) {
      events = events.filter((e) => new Date(e.startsOn).getTime() <= to.getTime());
    }
  }
  if (org) {
    const needle = org.toLowerCase();
    events = events.filter((e) => (e.org || "").toLowerCase().includes(needle));
  }

  events.sort((a, b) => new Date(a.startsOn).getTime() - new Date(b.startsOn).getTime());
  const limited = events.slice(0, limit);

  const res = NextResponse.json({
    lastRefresh: resPayload.lastRefreshIso,
    count: limited.length,
    events: limited,
  });
  enableCors(res);
  return res;
}


