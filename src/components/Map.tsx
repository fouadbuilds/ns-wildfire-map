import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import type { LocationWithRisk } from '../types'
import 'leaflet/dist/leaflet.css'

interface Props {
  locations: LocationWithRisk[]
}

export default function Map({ locations }: Props) {
  return (
    <MapContainer
      center={[44.8, -63.1]}
      zoom={7}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map(loc => {
        if (!loc.risk) return null

        const isHighRisk = loc.risk.score >= 50

        return (
          <CircleMarker
            key={loc.id}
            center={[loc.lat, loc.lng]}
            radius={isHighRisk ? 18 : 12}
            pathOptions={{
              fillColor: loc.risk.color,
              fillOpacity: 0.85,
              color: loc.risk.color,
              weight: isHighRisk ? 3 : 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div className="text-sm font-semibold">{loc.name}</div>
              <div style={{ color: loc.risk.color }} className="font-bold">
                {loc.risk.level} — {loc.risk.score}/100
              </div>
              {loc.weather && (
                <div className="text-xs text-gray-600 mt-1">
                  🌡️ {loc.weather.temperature}°C &nbsp;
                  💧 {loc.weather.humidity}% &nbsp;
                  💨 {loc.weather.windspeed}km/h
                </div>
              )}
            </Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}