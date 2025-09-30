// Types for Engage (Rowan CampusLabs) raw event payloads and our normalized public schema

export interface EngageRawEvent {
  id: string;
  institutionId?: number;
  organizationId?: number;
  organizationIds?: string[];
  branchId?: number;
  branchIds?: string[];
  organizationName?: string;
  organizationProfilePicture?: string | null;
  organizationNames?: string[];
  name: string;
  description?: string | null;
  location?: string | null;
  startsOn: string; // ISO string
  endsOn: string; // ISO string
  imagePath?: string | null;
  theme?: string | null;
  categoryIds?: string[];
  categoryNames?: string[];
  benefitNames?: string[];
  visibility?: string; // e.g., "Public"
  status?: string; // e.g., "Approved"
  latitude?: number | null;
  longitude?: number | null;
  recScore?: unknown;
  rsvpTotal?: number;
  "@search.score"?: number;
}

export interface PublicEvent {
  id: string;
  title: string;
  startsOn: string; // ISO
  endsOn: string; // ISO
  org: string | null;
  locationText: string | null;
  benefits: string[];
  eventUrl: string;
  imageUrl: string | null;
}

export interface FreeFoodCachePayload {
  schemaVersion: number;
  lastRefreshIso: string; // ISO timestamp when cache was updated
  sourceCount: number; // total events from Engage response (after query)
  filteredCount: number; // total events after applying strict filter
  refreshDurationMs: number;
  events: PublicEvent[];
}

export interface FetchStats {
  url: string;
  attempts: number;
  durationMs: number;
}


