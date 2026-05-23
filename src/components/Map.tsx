import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { LocationWithRisk } from "../types";
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
  pulse: boolean,
  selected: boolean,
): L.DivIcon {
  const size = selected ? 36 : 28;
  const pulseRing = pulse
    ? `
    <span style="
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 2px solid ${color};
      opacity: 0.4;
      animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
    "/>
    <span style="
      position: absolute;
      inset: -12px;
      border-radius: 50%;
      border: 1.5px solid ${color};
      opacity: 0.2;
      animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
      animation-delay: 0.3s;
    "/>
  `
    : "";

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
      ">
        ${pulseRing}
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color}22;
          border: 1.5px solid ${color}99;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${selected ? 18 : 14}px;
          backdrop-filter: blur(4px);
          box-shadow: 0 0 ${selected ? 16 : 8}px ${color}55;
          transition: all 0.3s ease;
        ">🔥</div>
      </div>
      <style>
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.4; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapInner({ locations, selectedId, onSelect }: Props) {
  const map = useMap();
  const markersRef = useRef<Record<string, L.Marker>>({});

  // Fly to selected
  useEffect(() => {
    if (!selectedId) return;
    const loc = locations.find((l) => l.id === selectedId);
    if (loc) map.flyTo([loc.lat, loc.lng], 11, { duration: 1.2 });
  }, [selectedId, locations, map]);

  // Render markers
  useEffect(() => {
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};
    locations.forEach((loc) => {
      if (!loc.risk) return;

      const pulse = loc.risk.score >= 60;
      const selected = loc.id === selectedId;
      const color = getRiskColor(loc.risk.score);
      const icon = createFlameIcon(color, pulse, selected);

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
          <div style="font-size: 11px; font-weight: 700; color: ${color};">
            ${loc.risk.level} — ${loc.risk.score}/100
          </div>
          ${
            loc.weather
              ? `
            <div style="font-size: 10px; color: #ffffff44; margin-top: 6px; display: flex; gap: 8px;">
              <span>🌡️ ${loc.weather.temperature}°C</span>
              <span>💨 ${loc.weather.windspeed}km/h</span>
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
  }, [locations, selectedId, map, onSelect]);

  return null;
}

export default function Map({ locations, selectedId, onSelect }: Props) {
  return (
    <>
      <style>{`
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
