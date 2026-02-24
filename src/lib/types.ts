// ============================================================
// Atlas Schema v2 — Event-First Architecture
// ============================================================
// Features = locations (map pins)
// Events = things that happened at locations
// Evidence = source documents supporting events

/** A person referenced in an event */
export interface EventPerson {
  name: string;
  role: string;
}

/** A source document providing evidence for an event */
export interface EventSource {
  doc_id: string;
  file?: string;
  source_type: string;
  doc_type?: string;
  excerpt: string;
  document_url?: string;
}

/** Evidence piece — a single source corroborating an event */
export interface EvidencePiece {
  file: string;
  source_type: string;
  doc_type: string;
  excerpt: string;
  summary: string;
  confidence: number;
  date_start: string;
  document_url?: string;
}

/** Epstein nexus classification */
export type EpsteinNexusLevel = "direct" | "implied" | "contextual" | "unrelated";

/** An event — something that happened at a location */
export interface AtlasEvent {
  event_id: string;
  event_title: string;
  event_type: EventType;
  description: string;
  date_start: string | null;
  date_end: string | null;
  date_precision: string;
  confidence: number;
  people: EventPerson[];
  presence_type: PresenceType;
  epstein_nexus?: EpsteinNexusLevel;
  nexus_reasoning?: string;
  evidence: EvidencePiece[];
}

/** Epstein nexus classification */
export type EpsteinNexus = "direct" | "indirect" | "contextual";

/** Presence type — direct observation vs circumstantial inference */
export type PresenceType = "direct" | "implied";

/** GeoJSON Feature — a location pin on the map containing events */
export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    id: string;
    location_name: string;
    location_address?: string;
    location_description?: string;
    canonical_name: string;
    region: string;
    property_type?: string;

    // Aggregated for map rendering
    event_count: number;
    evidence_count: number;
    primary_event_type: EventType;
    confidence: number;
    confidence_tier: ConfidenceTier;
    date_start: string | null;
    date_end: string | null;
    people: EventPerson[];
    source_count: number;
    sources_preview: string;
    presence_type: PresenceType;
    epstein_nexus: EpsteinNexus;

    // The events at this location
    events: AtlasEvent[];

    // Legacy compat fields (still written by pipeline)
    display_name: string;
    event_type: string;
    event_description: string;
    sources?: EventSource[];

    // Phase 2: Implied presence fields
    inference_rule?: string;
    inference_confidence?: number | null;
    inference_reasoning?: string;

    // Legacy compat — these may not exist in new data but old components reference them
    evidence?: EvidencePiece[];
    citations?: EnrichedCitation[];
    connected_travel?: ConnectedTravel[];
    quality_tier?: QualityTier;
    significance_tier?: SignificanceTier;
    significance_summary?: string;
    confidence_breakdown?: ConfidenceBreakdown;
    corroboration_count?: number;
    date_precision?: string;
  };
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
  _metadata?: {
    generated_at: string;
    pipeline: string;
    schema_version: string;
    total_locations: number;
    total_events: number;
    total_evidence: number;
  };
}

export type ConfidenceTier = "high" | "moderate" | "low" | "very_low";

export type EventType =
  | "presence"
  | "abuse"
  | "legal";

export interface FilterState {
  people: string[];
  searchQuery: string;
  nexusLevels: string[];
}

export interface TimelineData {
  year: number;
  count: number;
  avgConfidence: number;
}

export interface LocationSummary {
  canonical_name: string;
  display_name: string;
  lat: number;
  lng: number;
  total_events: number;
  event_types: Record<string, number>;
  date_range: [string | null, string | null];
  avg_confidence: number;
  people: string[];
  region: string;
  property_type?: string;
}

// Legacy compat types (some components may still reference these)
export type SignificanceTier = "key_property" | "documented_events" | "contact_network" | "single_mention";
export type QualityTier = "substantial" | "moderate" | "minimal";
export type InferenceRule = string;

export interface EnrichedPerson {
  name: string;
  role: string;
}

export interface EnrichedCitation {
  source_type: string;
  source_id?: string;
  excerpt?: string;
  page?: number;
  document_url?: string;
  extraction_method?: string;
}

export interface PersonReference {
  name: string;
  role: string;
  original_text?: string;
}

export interface SourceCitation {
  source_id: string;
  source_type: string;
  source_url?: string;
  page?: number;
  excerpt: string;
  extraction_method: string;
}

export interface ConfidenceBreakdown {
  source_reliability: number;
  extraction_quality: number;
  geocoding_precision: number;
  temporal_precision: number;
  corroboration: number;
}

export interface ConnectedTravel {
  direction: "from" | "to";
  location: string;
  date?: string;
}
