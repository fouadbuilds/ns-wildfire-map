import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { LocationWithRisk } from "../types";
import { estimateTimeToImpact } from "../utils/spread";
import "leaflet/dist/leaflet.css";

interface Props {
  locations: LocationWithRisk[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function getRiskColor(score: number): string {
  if (score >= 80) return "#9333EA";
  if (score >= 60) return "#EF4444";
  if (score >= 40) return "#F97316";
  if (score >= 20) return "#EAB308";
  return "#22C55E";
}

function createFlameIcon(
  color: string,
  _pulse: boolean,
  selected: boolean,
  score: number,
): L.DivIcon {
  const opacity = score < 20 ? 0.25 : score < 40 ? 0.5 : 1;
  const size = selected ? 40 : score >= 60 ? 32 : score >= 40 ? 26 : 18;

  return L.divIcon({
    className: "",
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: ${opacity};
        transition: opacity 0.3s ease;
      ">
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color}${score >= 60 ? "33" : "18"};
          border: ${score >= 60 ? "2px" : "1px"} solid ${color}${score >= 60 ? "cc" : "66"};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${size * 0.5}px;
          box-shadow: ${score >= 60 ? `0 0 20px ${color}44, 0 0 40px ${color}22` : "none"};
          transition: all 0.3s ease;
        ">
          ${score >= 60 ? "🔥" : score >= 40 ? "⚠️" : "·"}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapInner({ locations, selectedId, onSelect }: Props) {
  const map = useMap();
  const markersRef = useRef<Record<string, L.Marker>>({});
  const heatRef = useRef<L.LayerGroup | null>(null);

  // Fly to selected
  useEffect(() => {
    if (!selectedId) return;
    const loc = locations.find((l) => l.id === selectedId);
    if (loc) map.flyTo([loc.lat, loc.lng], 11, { duration: 1.2 });
  }, [selectedId, locations, map]);

  // Wind arrow control
  useEffect(() => {
    const loaded = locations.filter((l) => l.weather);
    if (!loaded.length) return;

    const avgDir =
      loaded.reduce((sum, l) => sum + l.weather!.windDirection, 0) /
      loaded.length;
    const avgSpeed =
      loaded.reduce((sum, l) => sum + l.weather!.windspeed, 0) / loaded.length;

    const windControl = new L.Control({ position: "bottomleft" });
    windControl.onAdd = () => {
      const div = L.DomUtil.create("div");
      div.innerHTML = `
        <div style="
          background: white;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          padding: 10px 14px;
          font-family: system-ui;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">
          <div style="
            font-size: 22px;
            transform: rotate(${avgDir}deg);
            display: inline-block;
          ">↑</div>
          <div>
            <div style="font-size: 9px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.1em;">Wind</div>
            <div style="font-size: 12px; font-weight: 600; color: #1a1a1a;">${Math.round(avgSpeed)} km/h</div>
          </div>
        </div>
      `;
      return div;
    };
    windControl.addTo(map);

    return () => {
      windControl.remove();
    };
  }, [locations, map]);

  // Render markers
  useEffect(() => {
    if (heatRef.current) {
      heatRef.current.remove();
      heatRef.current = null;
    }

    const heatGroup = L.layerGroup().addTo(map);
    heatRef.current = heatGroup;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    locations.forEach((loc) => {
      if (!loc.risk) return;

      // compute minutes-to-impact using nearest sources
      const minutes = estimateTimeToImpact(loc, locations);

      const pulse = loc.risk.score >= 60;
      const selected = loc.id === selectedId;
      const color = getRiskColor(loc.risk.score);
      const icon = createFlameIcon(color, pulse, selected, loc.risk.score);

      const heatStrength = Math.max(0.22, Math.min(0.72, loc.risk.score / 120));
      const heatRadius = selected
        ? 42
        : loc.risk.score >= 60
          ? 36
          : loc.risk.score >= 40
            ? 30
            : 24;

      L.circleMarker([loc.lat, loc.lng], {
        radius: heatRadius,
        color,
        weight: 0,
        fillColor: color,
        fillOpacity: heatStrength,
        pane: "overlayPane",
      }).addTo(heatGroup);

      L.circleMarker([loc.lat, loc.lng], {
        radius: heatRadius * 1.55,
        color,
        weight: 1,
        opacity: 0.18,
        fillColor: color,
        fillOpacity: 0.06,
        pane: "overlayPane",
      }).addTo(heatGroup);

      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .on("click", () => onSelect(loc.id));

      const tooltipContent = `
        <div style="
          background: #1a1a1a;
          border: 1px solid ${color}44;
          border-radius: 8px;
          padding: 8px 12px;
          font-family: system-ui, sans-serif;
          min-width: 140px;
        ">
          <div style="font-size: 12px; font-weight: 600; color: white; margin-bottom: 4px;">
            ${loc.name}
          </div>
          <div style="font-size: 10px; color: #ffffff55; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
            ${loc.region}
          </div>
          <div style="font-size: 11px; font-weight: 700; color: ${color};">${loc.risk.level} — ${loc.risk.score}/100</div>
          ${
            minutes
              ? `
            <div style="font-size:11px; color:#ffffff66; margin-top:6px">
              ⏱️ ~${minutes} min to impact
            </div>
          `
              : ""
          }
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        permanent: false,
        direction: "top",
        offset: [0, -16],
        opacity: 1,
        className: "firewatch-tooltip",
      });

      markersRef.current[loc.id] = marker;
    });

    return () => {
      heatGroup.remove();
      heatRef.current = null;
    };
  }, [locations, selectedId, map, onSelect]);

  return null;
}

export default function Map({ locations, selectedId, onSelect }: Props) {
  return (
    <>
      <style>{`
        .leaflet-overlay-pane {
          mix-blend-mode: multiply;
        }
        .firewatch-tooltip .leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-tooltip-top::before {
          display: none !important;
        }
      `}</style>
      <MapContainer
        center={[45.0, -63.2]}
        zoom={7}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapInner
          locations={locations}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </MapContainer>
    </>
  );
}
