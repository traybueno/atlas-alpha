"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { GeoJSONFeatureCollection, GeoJSONFeature } from "@/lib/types";
import { inferQualityTier } from "@/lib/data";

interface AtlasMapProps {
  data: GeoJSONFeatureCollection;
  onFeatureClick: (feature: GeoJSONFeature) => void;
  onLocationClick: (locationName: string, features: GeoJSONFeature[]) => void;
  onCinemaDeselect?: () => void;
  selectedFeatureId?: string;
  dateRange?: [string | null, string | null];
  mapStyle?: "light" | "satellite";
}

/**
 * Mapbox GL serializes nested objects/arrays as JSON strings.
 * This helper parses them back so downstream components get real objects.
 */
function deserializeMapboxFeature(feature: mapboxgl.MapboxGeoJSONFeature): GeoJSONFeature {
  const props = { ...feature.properties } as Record<string, unknown>;

  // Fields that Mapbox may serialize as JSON strings
  const jsonFields = ["people", "events", "evidence", "sources", "citations", "connected_travel", "confidence_breakdown"];
  for (const field of jsonFields) {
    if (typeof props[field] === "string") {
      try {
        props[field] = JSON.parse(props[field] as string);
      } catch {
        // If it's people, default to empty array; others keep as-is
        if (field === "people" || field === "events" || field === "evidence" || field === "sources" || field === "citations" || field === "connected_travel") {
          props[field] = [];
        }
      }
    }
  }

  // Ensure critical array fields are arrays (not null/undefined)
  if (!Array.isArray(props.people)) props.people = [];
  if (!Array.isArray(props.events)) props.events = [];

  return {
    type: "Feature",
    geometry: feature.geometry as GeoJSONFeature["geometry"],
    properties: props as unknown as GeoJSONFeature["properties"],
  };
}

export default function AtlasMap({
  data,
  onFeatureClick,
  onLocationClick,
  onCinemaDeselect,
  selectedFeatureId,
  dateRange,
  mapStyle = "light",
}: AtlasMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);

  // ── Cinema mode ──────────────────────────────────────────────────────────
  const [mapReady, setMapReady] = useState(false);
  const cinemaActiveRef = useRef(false);
  const cinemaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinRafRef = useRef<number | null>(null);
  const dataRef = useRef(data);
  const onFeatureClickRef = useRef(onFeatureClick);
  const onCinemaDeselectRef = useRef(onCinemaDeselect);
  const cinemaLoopRef = useRef<() => void>(() => {});

  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { onFeatureClickRef.current = onFeatureClick; }, [onFeatureClick]);
  useEffect(() => { onCinemaDeselectRef.current = onCinemaDeselect; }, [onCinemaDeselect]);

  // Keep cinemaLoopRef current every render (safe — just a ref assignment)
  cinemaLoopRef.current = () => {
    if (!cinemaActiveRef.current || !map.current) return;

    // Stop spinning while flying
    if (spinRafRef.current) { cancelAnimationFrame(spinRafRef.current); spinRafRef.current = null; }

    // Pick a random well-evidenced pin
    const eligible = dataRef.current.features.filter(
      (f) => f.geometry.type === "Point" && (f.properties?.event_count ?? 0) >= 2
    );
    if (!eligible.length) return;
    const feature = eligible[Math.floor(Math.random() * eligible.length)];
    const [lng, lat] = (feature.geometry as { type: "Point"; coordinates: [number, number] }).coordinates;

    // Fly in — zoom 13 guarantees we're past clusterMaxZoom (10) and see individual pins
    map.current.flyTo({ center: [lng, lat], zoom: 13, bearing: 0, pitch: 0, duration: 2500, essential: true });

    // Open sidebar after landing + ripple at the pin
    cinemaTimerRef.current = setTimeout(() => {
      if (!cinemaActiveRef.current) return;
      onFeatureClickRef.current(feature);
      const projected = map.current?.project([lng, lat]);
      if (projected) triggerRippleRef.current(projected);

      // Close + zoom out after displaying
      cinemaTimerRef.current = setTimeout(() => {
        if (!cinemaActiveRef.current) return;
        onCinemaDeselectRef.current?.();
        map.current?.flyTo({ center: [-20, 0], zoom: 1.5, bearing: 0, pitch: 0, duration: 2500, essential: true });

        // Resume spinning, then loop again
        cinemaTimerRef.current = setTimeout(() => {
          if (!cinemaActiveRef.current || !map.current) return;
          // Spin by incrementing center longitude — correct globe axis (east-west rotation)
          const spin = () => {
            if (!cinemaActiveRef.current || !map.current) return;
            const c = map.current.getCenter();
            map.current.setCenter([(c.lng + 0.08) % 360, c.lat]);
            spinRafRef.current = requestAnimationFrame(spin);
          };
          spinRafRef.current = requestAnimationFrame(spin);
          cinemaTimerRef.current = setTimeout(() => cinemaLoopRef.current(), 3000);
        }, 2600);
      }, 3800);
    }, 2700);
  };

  const stopCinema = useCallback(() => {
    if (!cinemaActiveRef.current) return;
    cinemaActiveRef.current = false;
    if (cinemaTimerRef.current) { clearTimeout(cinemaTimerRef.current); cinemaTimerRef.current = null; }
    if (spinRafRef.current) { cancelAnimationFrame(spinRafRef.current); spinRafRef.current = null; }
    onCinemaDeselectRef.current?.();
    // cinemaActiveRef = false is enough — no persistent storage needed
  }, []);

  useEffect(() => {
    if (!mapReady) return;

    cinemaActiveRef.current = true;
    const canvas = map.current?.getCanvas();

    const handleInteraction = () => stopCinema();
    canvas?.addEventListener("mousedown", handleInteraction, { once: true });
    canvas?.addEventListener("touchstart", handleInteraction, { once: true, passive: true });
    canvas?.addEventListener("wheel", handleInteraction, { once: true, passive: true });
    document.addEventListener("keydown", handleInteraction, { once: true });

    // Fly to full-globe overview first so both poles are in frame
    map.current?.flyTo({ center: [-20, 0], zoom: 1.5, bearing: 0, pitch: 0, duration: 1800, essential: true });

    const spin = () => {
      if (!cinemaActiveRef.current || !map.current) return;
      const c = map.current.getCenter();
      map.current.setCenter([(c.lng + 0.08) % 360, c.lat]);
      spinRafRef.current = requestAnimationFrame(spin);
    };

    // Start spinning after fly-in settles; first pin visit 3s after that
    cinemaTimerRef.current = setTimeout(() => {
      if (!cinemaActiveRef.current) return;
      spinRafRef.current = requestAnimationFrame(spin);
      cinemaTimerRef.current = setTimeout(() => cinemaLoopRef.current(), 3000);
    }, 1900);

    return () => {
      stopCinema();
      canvas?.removeEventListener("mousedown", handleInteraction);
      canvas?.removeEventListener("touchstart", handleInteraction);
      canvas?.removeEventListener("wheel", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [mapReady, stopCinema]);
  // ── End cinema mode ───────────────────────────────────────────────────────

  // ── Selected-pin highlight ─────────────────────────────────────────────────
  // Ripple trigger — stored in a ref so map click handlers can call it without
  // being in their dependency list
  const triggerRippleRef = useRef<(point: { x: number; y: number }) => void>(() => {});
  triggerRippleRef.current = (point: { x: number; y: number }) => {
    if (!mapContainer.current) return;
    const el = document.createElement("div");
    el.className = "pin-ripple";
    el.style.left = `${point.x}px`;
    el.style.top = `${point.y}px`;
    mapContainer.current.appendChild(el);
    setTimeout(() => el.remove(), 650);
  };

  // Update map paint whenever the selected feature changes
  useEffect(() => {
    if (!map.current || !mapReady) return;
    const selId = selectedFeatureId ?? "__none__";
    const SEL_FILL   = "#ffffff";
    const SEL_STROKE = "#3b82f6";   // blue-500 — pops against all pin colours
    const SEL_SW     = 3.5;

    try {
      // ── unclustered-point ──────────────────────────────────────────────
      map.current.setPaintProperty("unclustered-point", "circle-color", [
        "case", ["==", ["get", "id"], selId], SEL_FILL,
        ["interpolate", ["linear"], ["get", "confidence"],
          0.4, "#f97316", 0.6, "#eab308", 0.8, "#22c55e"],
      ]);
      map.current.setPaintProperty("unclustered-point", "circle-stroke-color", [
        "case", ["==", ["get", "id"], selId], SEL_STROKE, "#ffffff",
      ]);
      map.current.setPaintProperty("unclustered-point", "circle-stroke-width", [
        "case", ["==", ["get", "id"], selId], SEL_SW, 2,
      ]);
      map.current.setPaintProperty("unclustered-point", "circle-radius", [
        "case", ["==", ["get", "id"], selId],
        ["interpolate", ["linear"], ["get", "event_count"], 1, 9, 10, 13, 50, 19, 100, 25],
        ["interpolate", ["linear"], ["get", "event_count"], 1, 6, 10, 10, 50, 16, 100, 22],
      ]);

      // ── unclustered-point-implied ──────────────────────────────────────
      map.current.setPaintProperty("unclustered-point-implied", "circle-color", [
        "case", ["==", ["get", "id"], selId], SEL_FILL,
        ["interpolate", ["linear"], ["get", "confidence"],
          0.2, "#fbbf24", 0.5, "#f59e0b", 0.8, "#d97706"],
      ]);
      map.current.setPaintProperty("unclustered-point-implied", "circle-stroke-color", [
        "case", ["==", ["get", "id"], selId], SEL_STROKE, "#fbbf24",
      ]);
      map.current.setPaintProperty("unclustered-point-implied", "circle-stroke-width", [
        "case", ["==", ["get", "id"], selId], SEL_SW, 2,
      ]);

      // ── unclustered-point-minimal ──────────────────────────────────────
      map.current.setPaintProperty("unclustered-point-minimal", "circle-color", [
        "case", ["==", ["get", "id"], selId], SEL_FILL, "#9ca3af",
      ]);
      map.current.setPaintProperty("unclustered-point-minimal", "circle-stroke-color", [
        "case", ["==", ["get", "id"], selId], SEL_STROKE, "#d1d5db",
      ]);
      map.current.setPaintProperty("unclustered-point-minimal", "circle-stroke-width", [
        "case", ["==", ["get", "id"], selId], SEL_SW, 1,
      ]);
    } catch {
      // Layers not yet added (map not fully loaded); no-op
    }
  }, [selectedFeatureId, mapReady]);
  // ── End selected-pin highlight ─────────────────────────────────────────────

  const initMap = useCallback(() => {
    if (!mapContainer.current || map.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("NEXT_PUBLIC_MAPBOX_TOKEN is not set");
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        mapStyle === "satellite"
          ? "mapbox://styles/mapbox/satellite-streets-v12"
          : "mapbox://styles/mapbox/light-v11",
      center: [-72, 30],
      zoom: 3.5,
      minZoom: 1,
      maxZoom: 18,
      attributionControl: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.current.addControl(
      new mapboxgl.ScaleControl({ maxWidth: 200 }),
      "bottom-left"
    );

    popup.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: "320px",
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Enrich features with quality_tier and presence_type for map styling
      const enrichedData: GeoJSONFeatureCollection = {
        ...data,
        features: data.features.map((f) => ({
          ...f,
          properties: {
            ...f.properties,
            _is_minimal: inferQualityTier(f) === "minimal" ? 1 : 0,
            _is_implied: 0,
          },
        })),
      };

      // Add source
      map.current.addSource("atlas-points", {
        type: "geojson",
        data: enrichedData,
        cluster: true,
        clusterMaxZoom: 10,
        clusterRadius: 50,
        clusterProperties: {
          sum_events: ["+", ["get", "event_count"]],
          avg_confidence: [
            "/",
            ["+", ["get", "confidence"]],
            ["get", "point_count"],
          ],
        },
      });

      // Cluster layer
      map.current.addLayer({
        id: "clusters",
        type: "circle",
        source: "atlas-points",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#94a3b8", // slate-400 for small clusters
            10,
            "#64748b", // slate-500
            50,
            "#475569", // slate-600
            100,
            "#334155", // slate-700
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            18,
            10,
            24,
            50,
            32,
            100,
            40,
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.85,
        },
      });

      // Cluster count label
      map.current.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "atlas-points",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Individual points — substantial/moderate quality (DIRECT evidence only)
      map.current.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "atlas-points",
        filter: ["all", ["!", ["has", "point_count"]], ["!=", ["get", "_is_minimal"], 1], ["!=", ["get", "_is_implied"], 1]],
        paint: {
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "confidence"],
            0.4,
            "#f97316", // orange
            0.6,
            "#eab308", // yellow
            0.8,
            "#22c55e", // green
          ],
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "event_count"],
            1,
            6,
            10,
            10,
            50,
            16,
            100,
            22,
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.9,
        },
      });

      // Individual points — implied presence (amber, hollow-look, lower opacity)
      map.current.addLayer({
        id: "unclustered-point-implied",
        type: "circle",
        source: "atlas-points",
        filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "_is_implied"], 1], ["!=", ["get", "_is_minimal"], 1]],
        paint: {
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "confidence"],
            0.2,
            "#fbbf24", // amber-400
            0.5,
            "#f59e0b", // amber-500
            0.8,
            "#d97706", // amber-600
          ],
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "event_count"],
            1,
            5,
            10,
            9,
            50,
            14,
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fbbf24", // amber-400
          "circle-opacity": 0.6,
        },
      });

      // Individual points — minimal quality (dimmer, smaller)
      map.current.addLayer({
        id: "unclustered-point-minimal",
        type: "circle",
        source: "atlas-points",
        filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "_is_minimal"], 1]],
        paint: {
          "circle-color": "#9ca3af", // gray-400
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#d1d5db", // gray-300
          "circle-opacity": 0.45,
        },
      });

      // Click on cluster → zoom in
      map.current.on("click", "clusters", (e) => {
        if (!map.current) return;
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        if (!features.length) return;
        const clusterId = features[0].properties?.cluster_id;
        const source = map.current.getSource(
          "atlas-points"
        ) as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !map.current) return;
          const geom = features[0].geometry;
          if (geom.type === "Point") {
            map.current.easeTo({
              center: geom.coordinates as [number, number],
              zoom: zoom ?? 10,
            });
          }
        });
      });

      // Click on implied point → open detail
      map.current.on("click", "unclustered-point-implied", (e) => {
        if (!e.features?.length) return;
        triggerRippleRef.current(e.point);
        const feature = e.features[0];
        if (feature.properties) {
          onFeatureClick(deserializeMapboxFeature(feature));
        }
      });

      // Click on minimal point → open detail
      map.current.on("click", "unclustered-point-minimal", (e) => {
        if (!e.features?.length) return;
        triggerRippleRef.current(e.point);
        const feature = e.features[0];
        if (feature.properties) {
          onFeatureClick(deserializeMapboxFeature(feature));
        }
      });

      // Click on point → open detail
      map.current.on("click", "unclustered-point", (e) => {
        if (!e.features?.length) return;
        triggerRippleRef.current(e.point);
        const feature = e.features[0];
        if (feature.properties) {
          onFeatureClick(deserializeMapboxFeature(feature));
        }
      });

      // Hover on point → tooltip (standardized 3-line format)
      map.current.on("mouseenter", "unclustered-point", (e) => {
        if (!map.current || !popup.current || !e.features?.length) return;
        map.current.getCanvas().style.cursor = "pointer";

        const feature = e.features[0];
        const props = feature.properties;
        const geom = feature.geometry;
        if (!props || geom.type !== "Point") return;

        const eventCount = props.event_count || 1;
        const locationName = props.location_name || props.display_name;
        const dateStart = props.date_start ? props.date_start.substring(0, 4) : "";
        const dateEnd = props.date_end ? props.date_end.substring(0, 4) : "";
        const dateRange = dateStart && dateEnd && dateStart !== dateEnd
          ? `${dateStart}–${dateEnd}` : dateStart || "";

        popup.current
          .setLngLat(geom.coordinates as [number, number])
          .setHTML(
            `<div style="font-family: system-ui, sans-serif;">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${locationName}</div>
              <div style="font-size: 12px; color: #666;">${props.region || ""}</div>
              <div style="font-size: 12px; color: #888; margin-top: 2px;">${eventCount} event${eventCount !== 1 ? "s" : ""}${dateRange ? ` · ${dateRange}` : ""}</div>
            </div>`
          )
          .addTo(map.current);
      });

      map.current.on("mouseleave", "unclustered-point", () => {
        if (!map.current || !popup.current) return;
        map.current.getCanvas().style.cursor = "";
        popup.current.remove();
      });

      // Hover on implied point → tooltip (standardized)
      map.current.on("mouseenter", "unclustered-point-implied", (e) => {
        if (!map.current || !popup.current || !e.features?.length) return;
        map.current.getCanvas().style.cursor = "pointer";

        const feature = e.features[0];
        const props = feature.properties;
        const geom = feature.geometry;
        if (!props || geom.type !== "Point") return;

        const eventCount = props.event_count || 1;
        const locationName = props.location_name || props.display_name;

        popup.current
          .setLngLat(geom.coordinates as [number, number])
          .setHTML(
            `<div style="font-family: system-ui, sans-serif;">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 2px;">${locationName}</div>
              <div style="font-size: 12px; color: #6b7280;"></div>
              <div style="font-size: 12px; color: #888; margin-top: 2px;">${eventCount} event${eventCount !== 1 ? "s" : ""}${props.date_start ? ` · ${props.date_start.substring(0, 4)}` : ""}</div>
            </div>`
          )
          .addTo(map.current);
      });

      map.current.on("mouseleave", "unclustered-point-implied", () => {
        if (!map.current || !popup.current) return;
        map.current.getCanvas().style.cursor = "";
        popup.current.remove();
      });

      // Hover on minimal point → tooltip
      map.current.on("mouseenter", "unclustered-point-minimal", (e) => {
        if (!map.current || !popup.current || !e.features?.length) return;
        map.current.getCanvas().style.cursor = "pointer";
        const feature = e.features[0];
        const props = feature.properties;
        const geom = feature.geometry;
        if (!props || geom.type !== "Point") return;
        popup.current
          .setLngLat(geom.coordinates as [number, number])
          .setHTML(
            `<div style="font-family: system-ui, sans-serif;">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${props.display_name}</div>
              <div style="font-size: 11px; color: #9ca3af;">Contact network address — limited data</div>
            </div>`
          )
          .addTo(map.current);
      });
      map.current.on("mouseleave", "unclustered-point-minimal", () => {
        if (!map.current || !popup.current) return;
        map.current.getCanvas().style.cursor = "";
        popup.current.remove();
      });

      // Hover cursor on clusters
      map.current.on("mouseenter", "clusters", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "clusters", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });

      // Signal that the map is ready for cinema mode
      setMapReady(true);
    });
  }, [data, mapStyle, onFeatureClick, onLocationClick]);

  // Initialize map
  useEffect(() => {
    initMap();
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initMap]);

  // Update data when it changes
  useEffect(() => {
    if (!map.current) return;
    const source = map.current.getSource(
      "atlas-points"
    ) as mapboxgl.GeoJSONSource;
    if (source) {
      const enrichedData: GeoJSONFeatureCollection = {
        ...data,
        features: data.features.map((f) => ({
          ...f,
          properties: {
            ...f.properties,
            _is_minimal: inferQualityTier(f) === "minimal" ? 1 : 0,
            _is_implied: 0,
          },
        })),
      };
      source.setData(enrichedData);
    }
  }, [data]);

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
}
