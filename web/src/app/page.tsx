"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PublicEvent {
  id: string;
  title: string;
  startsOn: string;
  endsOn: string;
  org: string | null;
  locationText: string | null;
  benefits: string[];
  eventUrl: string;
  imageUrl: string | null;
}

interface ApiResponse {
  lastRefresh: string | null;
  count: number;
  events: PublicEvent[];
}

function formatRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameDay = start.toDateString() === end.toDateString();
  const dateFmt: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const timeFmt: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  const d = start.toLocaleDateString(undefined, dateFmt);
  const t1 = start.toLocaleTimeString(undefined, timeFmt);
  const t2 = end.toLocaleTimeString(undefined, timeFmt);
  return sameDay ? `${d} • ${t1}–${t2}` : `${d} ${t1} → ${end.toLocaleDateString(undefined, dateFmt)} ${t2}`;
}

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [quick, setQuick] = useState<"all" | "today" | "week">("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/free-food")
      .then((r) => r.json())
      .then((j: ApiResponse) => {
        if (!cancelled) setData(j);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const events = data?.events ?? [];
    const needle = query.trim().toLowerCase();
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    return events
      .filter((e) => {
        if (!needle) return true;
        const inTitle = e.title.toLowerCase().includes(needle);
        const inOrg = (e.org || "").toLowerCase().includes(needle);
        const inLoc = (e.locationText || "").toLowerCase().includes(needle);
        return inTitle || inOrg || inLoc;
      })
      .filter((e) => {
        if (quick === "today") {
          const s = new Date(e.startsOn).getTime();
          return s >= startOfDay.getTime() && s <= endOfDay.getTime();
        }
        if (quick === "week") {
          const s = new Date(e.startsOn).getTime();
          const in7 = Date.now() + 7 * 24 * 60 * 60 * 1000;
          return s <= in7;
        }
        return true;
      })
      .sort((a, b) => new Date(a.startsOn).getTime() - new Date(b.startsOn).getTime());
  }, [data, query, quick]);

  const lastUpdatedText = useMemo(() => {
    if (!data?.lastRefresh) return null;
    const last = new Date(data.lastRefresh).getTime();
    const mins = Math.max(0, Math.round((Date.now() - last) / 60000));
    return `${mins}m ago`;
  }, [data]);

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold">RU Hungry • Free Food Events</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, org, or location"
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button variant={quick === "all" ? "default" : "outline"} onClick={() => setQuick("all")}>
              All
            </Button>
            <Button variant={quick === "today" ? "default" : "outline"} onClick={() => setQuick("today")}>
              Today
            </Button>
            <Button variant={quick === "week" ? "default" : "outline"} onClick={() => setQuick("week")}>
              This Week
            </Button>
          </div>
        </div>
        {lastUpdatedText && (
          <div className="text-sm text-gray-500">Last updated {lastUpdatedText}</div>
        )}

        {loading && <div>Loading events…</div>}
        {error && <div className="text-red-600">Error: {error}</div>}

        {!loading && !error && (
          <div className="grid gap-4">
            {filtered.length === 0 ? (
              <div className="text-gray-600">No free food events found.</div>
            ) : (
              filtered.map((e) => (
                <div key={e.id} className="rounded border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-lg font-medium">{e.title}</div>
                    <div className="text-sm text-gray-600">{formatRange(e.startsOn, e.endsOn)}</div>
                    <div className="text-sm text-gray-600">{e.org || ""}{e.locationText ? ` • ${e.locationText}` : ""}</div>
                    <div className="flex gap-2 flex-wrap text-xs">
                      {e.benefits.map((b) => (
                        <Badge key={b} variant={b.toLowerCase() === "free food" ? "default" : "outline"}>{b}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline">
                      <a href={e.eventUrl} target="_blank" rel="noreferrer">Event details</a>
                    </Button>
                    {e.locationText && (
                      <Button asChild variant="outline">
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.locationText)}`} target="_blank" rel="noreferrer">Open in Maps</a>
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
