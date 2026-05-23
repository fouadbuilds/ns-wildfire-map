import type { LocationWithRisk } from "../types";

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDlat = Math.sin(dLat / 2);
  const sinDlon = Math.sin(dLon / 2);
  const aVal =
    sinDlat * sinDlat + sinDlon * sinDlon * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return R * c;
}

// Estimate minutes until fire reaches `target` from nearest source with high risk.
// Simple model: spreadSpeed_km_per_hr = base + factor * windspeed_km_h
// minutes = (distance_km / spreadSpeed_km_per_hr) * 60
export function estimateTimeToImpact(
  target: LocationWithRisk,
  sources: LocationWithRisk[],
): number | null {
  if (!target) return null;

  // consider sources with risk >= High (>=40)
  const candidates = sources.filter(
    (s) => s.risk && s.risk.score >= 40 && s.id !== target.id,
  );
  if (candidates.length === 0) return null;

  // find nearest candidate by distance
  let nearest: LocationWithRisk | null = null;
  let minDist = Infinity;
  for (const c of candidates) {
    const d = haversineKm(
      { lat: target.lat, lng: target.lng },
      { lat: c.lat, lng: c.lng },
    );
    if (d < minDist) {
      minDist = d;
      nearest = c;
    }
  }

  if (!nearest) return null;

  // windspeed: prefer source weather, fall back to target, else 10 km/h
  const wind = nearest.weather?.windspeed ?? target.weather?.windspeed ?? 10;

  const spreadSpeed_kmh = 0.5 + 0.06 * wind; // conservative base
  const hours = minDist / Math.max(spreadSpeed_kmh, 0.01);
  const minutes = Math.round(hours * 60);

  return minutes;
}
